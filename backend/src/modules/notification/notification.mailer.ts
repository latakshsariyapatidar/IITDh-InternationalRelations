import nodemailer, { type Transporter } from "nodemailer";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";

// Reminders are stored first and emailed second: the admin panel is the source
// of truth, and a deployment with no SMTP credentials still keeps a complete
// record. Every failure here is logged and swallowed.

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.SMTP_HOST) return null;

  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    ...(env.SMTP_USER && {
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    }),
  });

  return transporter;
}

/**
 * Which desk an email belongs to. Inbound covers admissions, inbound exchange
 * and the expiry digest; outbound covers outbound applications.
 */
export type Desk = "INBOUND" | "OUTBOUND";

const DESK_EMAIL: Readonly<Record<Desk, string | undefined>> = {
  INBOUND: env.INBOUND_NOTIFICATION_EMAIL,
  OUTBOUND: env.OUTBOUND_NOTIFICATION_EMAIL,
};

/**
 * The IRO office inbox: the configured override, else the IRO office contact
 * already maintained in the contacts table.
 */
async function resolveOfficeRecipient(): Promise<string | null> {
  if (env.IRO_NOTIFICATION_EMAIL) return env.IRO_NOTIFICATION_EMAIL;

  const office = await prisma.contact.findFirst({
    where: { type: "IRO_OFFICE", isActive: true },
    select: { email: true },
  });

  return office?.email ?? null;
}

/**
 * Who an email for this desk goes to: the desk's own inbox plus the IRO office,
 * which receives everything. Each desk only ever sees its own mail.
 */
async function resolveRecipients(desk: Desk): Promise<string[]> {
  const candidates = [DESK_EMAIL[desk], await resolveOfficeRecipient()];
  const unique = new Map<string, string>();

  for (const email of candidates) {
    if (email && !unique.has(email.toLowerCase())) unique.set(email.toLowerCase(), email);
  }

  return [...unique.values()];
}

const HTML_ESCAPES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Reminder titles and messages are built from names typed into the public
 * application and visitor forms, so they reach these templates as untrusted
 * text and must not be able to contribute markup to the office's inbox.
 */
const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] as string);

interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
}

/** Sends one email to a desk and the IRO office. Returns whether it went out. */
async function deliver(desk: Desk, email: RenderedEmail, what: string): Promise<boolean> {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn(`[NOTIFICATIONS] SMTP_HOST is not configured — ${what} not emailed.`);
    return false;
  }

  const to = await resolveRecipients(desk);

  if (to.length === 0) {
    console.warn(
      `[NOTIFICATIONS] No ${desk.toLowerCase()} recipient found — ${what} not emailed. ` +
        `Set ${desk}_NOTIFICATION_EMAIL or IRO_NOTIFICATION_EMAIL, or add an active ` +
        "IRO_OFFICE contact.",
    );
    return false;
  }

  try {
    await mailer.sendMail({
      from: env.SMTP_FROM ?? to[0],
      to,
      // Applicant names reach the subject line, so fold any line breaks.
      subject: email.subject.replace(/\s+/g, " "),
      text: email.text,
      html: email.html,
    });
    return true;
  } catch (err) {
    console.error(`[NOTIFICATIONS] Failed to send ${what}:`, err);
    return false;
  }
}

export interface DigestItem {
  severity: string;
  title: string;
  message: string;
  dueDate: Date | null;
}

function renderDigest(items: readonly DigestItem[]): RenderedEmail {
  const lines = items.map((item) => {
    const due = item.dueDate ? ` (due ${item.dueDate.toISOString().slice(0, 10)})` : "";
    return `[${item.severity}] ${item.title}${due}\n    ${item.message}`;
  });

  const rows = items
    .map((item) => {
      const due = item.dueDate ? item.dueDate.toISOString().slice(0, 10) : "—";
      return (
        `<tr><td>${escapeHtml(item.severity)}</td>` +
        `<td>${escapeHtml(item.title)}</td>` +
        `<td>${escapeHtml(item.message)}</td>` +
        `<td>${escapeHtml(due)}</td></tr>`
      );
    })
    .join("");

  return {
    subject: `IRO reminders — ${items.length} item(s) need attention`,
    text: `IRO reminders — ${items.length} new item(s)\n\n${lines.join("\n\n")}`,
    html:
      `<p>IRO reminders — ${items.length} new item(s).</p>` +
      `<table border="1" cellpadding="6" cellspacing="0">` +
      `<tr><th>Severity</th><th>Item</th><th>Detail</th><th>Due</th></tr>${rows}</table>` +
      `<p>These are also listed in the IRO admin panel.</p>`,
  };
}

/**
 * Sends one digest for a scan's new reminders. Every expiry rule concerns the
 * inbound side, so the digest goes to the inbound desk and the IRO office.
 * Returns whether it went out.
 */
export async function sendReminderDigest(items: readonly DigestItem[]): Promise<boolean> {
  if (items.length === 0) return false;
  return deliver("INBOUND", renderDigest(items), `${items.length} reminder(s)`);
}

export interface ApplicationAlert {
  title: string;
  /** Label/value rows describing the application. */
  details: readonly (readonly [string, string])[];
}

function renderApplicationAlert(alert: ApplicationAlert): RenderedEmail {
  const lines = alert.details.map(([label, value]) => `${label}: ${value}`);

  const rows = alert.details
    .map(
      ([label, value]) =>
        `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return {
    subject: alert.title,
    text: `${alert.title}\n\n${lines.join("\n")}\n\nReview it in the IRO admin panel.`,
    html:
      `<p>${escapeHtml(alert.title)}</p>` +
      `<table border="1" cellpadding="6" cellspacing="0">${rows}</table>` +
      `<p>Review it in the IRO admin panel.</p>`,
  };
}

/**
 * Emails one newly received application to its desk and the IRO office.
 * Returns whether it went out.
 */
export function sendApplicationAlert(desk: Desk, alert: ApplicationAlert): Promise<boolean> {
  // The log line names the kind of alert, never the applicant.
  const what = `new ${desk.toLowerCase()} application alert`;
  return deliver(desk, renderApplicationAlert(alert), what);
}
