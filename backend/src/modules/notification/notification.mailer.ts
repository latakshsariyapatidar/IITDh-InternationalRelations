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
 * Where reminders go: the configured override, else the IRO office contact
 * already maintained in the contacts table.
 */
export async function resolveRecipient(): Promise<string | null> {
  if (env.IRO_NOTIFICATION_EMAIL) return env.IRO_NOTIFICATION_EMAIL;

  const office = await prisma.contact.findFirst({
    where: { type: "IRO_OFFICE", isActive: true },
    select: { email: true },
  });

  return office?.email ?? null;
}

export interface DigestItem {
  severity: string;
  title: string;
  message: string;
  dueDate: Date | null;
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
 * application and visitor forms, so they reach this template as untrusted text
 * and must not be able to contribute markup to the office's inbox.
 */
const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] as string);

function renderDigest(items: readonly DigestItem[]): { text: string; html: string } {
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
    text: `IRO reminders — ${items.length} new item(s)\n\n${lines.join("\n\n")}`,
    html:
      `<p>IRO reminders — ${items.length} new item(s).</p>` +
      `<table border="1" cellpadding="6" cellspacing="0">` +
      `<tr><th>Severity</th><th>Item</th><th>Detail</th><th>Due</th></tr>${rows}</table>` +
      `<p>These are also listed in the IRO admin panel.</p>`,
  };
}

/** Sends one digest for a scan's new reminders. Returns whether it went out. */
export async function sendReminderDigest(items: readonly DigestItem[]): Promise<boolean> {
  if (items.length === 0) return false;

  const mailer = getTransporter();

  if (!mailer) {
    console.warn(
      "[NOTIFICATIONS] SMTP_HOST is not configured — " +
        `${items.length} reminder(s) stored but not emailed.`,
    );
    return false;
  }

  const to = await resolveRecipient();

  if (!to) {
    console.warn(
      "[NOTIFICATIONS] No recipient found — set IRO_NOTIFICATION_EMAIL or add an " +
        "active IRO_OFFICE contact. Reminders stored but not emailed.",
    );
    return false;
  }

  const { text, html } = renderDigest(items);

  try {
    await mailer.sendMail({
      from: env.SMTP_FROM ?? to,
      to,
      subject: `IRO reminders — ${items.length} item(s) need attention`,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error("[NOTIFICATIONS] Failed to send reminder digest:", err);
    return false;
  }
}
