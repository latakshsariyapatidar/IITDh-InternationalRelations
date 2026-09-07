import { prisma } from "../../config/prisma.js";
import { createNotificationIfNew, markNotificationsEmailed } from "./notification.repository.js";
import { sendReminderDigest, type DigestItem } from "./notification.mailer.js";

// Daily sweep over everything that expires. Each rule raises one notification
// per (record, threshold) — the dedupe key carries the threshold, so a visa
// expiring in 60 days is flagged once now and again at 30, 14 and 7 days,
// rather than every morning in between.

const DAY_MS = 24 * 60 * 60 * 1000;

type Severity = "INFO" | "WARNING" | "CRITICAL";

interface ExpiryRule {
  type: "VISA_EXPIRING" | "PASSPORT_EXPIRING" | "MOU_EXPIRING" | "EXIT_DATE_APPROACHING";
  label: string;
  thresholds: readonly number[];
  severityFor: (daysLeft: number) => Severity;
}

const VISA_RULE: ExpiryRule = {
  type: "VISA_EXPIRING",
  label: "Visa expiring",
  thresholds: [60, 30, 14, 7],
  severityFor: (days) => (days <= 7 ? "CRITICAL" : "WARNING"),
};

const PASSPORT_RULE: ExpiryRule = {
  type: "PASSPORT_EXPIRING",
  label: "Passport expiring",
  thresholds: [90, 30],
  severityFor: () => "WARNING",
};

const EXIT_RULE: ExpiryRule = {
  type: "EXIT_DATE_APPROACHING",
  label: "Exit date approaching",
  thresholds: [14, 7],
  severityFor: () => "INFO",
};

const MOU_RULE: ExpiryRule = {
  type: "MOU_EXPIRING",
  label: "MOU expiring",
  thresholds: [90, 30],
  severityFor: () => "WARNING",
};

const ALL_RULES = [VISA_RULE, PASSPORT_RULE, EXIT_RULE, MOU_RULE];

/** Days from now until `date`, rounded up so "today" reads as 0. */
function daysUntil(date: Date, now: Date): number {
  return Math.ceil((date.getTime() - now.getTime()) / DAY_MS);
}

/**
 * The tightest threshold this date has already crossed, or null when it is
 * still further out than the widest one (or already past).
 */
function crossedThreshold(daysLeft: number, thresholds: readonly number[]): number | null {
  if (daysLeft < 0) return null;
  const crossed = [...thresholds].sort((a, b) => a - b).find((t) => daysLeft <= t);
  return crossed ?? null;
}

const isoDate = (date: Date): string => date.toISOString().slice(0, 10);

interface ExpiringSubject {
  id: string;
  entityType: string;
  name: string;
  detail: string;
  date: Date;
}

interface RaisedBatch {
  digest: DigestItem[];
  ids: string[];
}

async function raiseExpiryNotifications(
  rule: ExpiryRule,
  subjects: readonly ExpiringSubject[],
  now: Date,
): Promise<RaisedBatch> {
  const digest: DigestItem[] = [];
  const ids: string[] = [];

  for (const subject of subjects) {
    const daysLeft = daysUntil(subject.date, now);
    const threshold = crossedThreshold(daysLeft, rule.thresholds);
    if (threshold === null) continue;

    const severity = rule.severityFor(daysLeft);
    const title = `${rule.label}: ${subject.name}`;
    const message =
      `${subject.detail} — ${rule.label.toLowerCase()} on ${isoDate(subject.date)} ` +
      `(${daysLeft} day${daysLeft === 1 ? "" : "s"} left).`;

    const created = await createNotificationIfNew({
      type: rule.type,
      severity,
      title,
      message,
      entityType: subject.entityType,
      entityId: subject.id,
      dueDate: subject.date,
      dedupeKey: `${rule.type}:${subject.id}:${threshold}`,
    });

    // Null means this exact reminder was raised on an earlier run — skip it so
    // the digest only ever carries what is new.
    if (created) {
      digest.push({ severity, title, message, dueDate: subject.date });
      ids.push(created.id);
    }
  }

  return { digest, ids };
}

const INBOUND_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  nationality: true,
  passportExpiryDate: true,
  visaExpiryDate: true,
  exitDate: true,
} as const;

export interface ScanResult {
  created: number;
  emailed: boolean;
}

/**
 * Runs every expiry rule over both inbound registers and the MOUs, storing new
 * reminders and emailing one digest for whatever was new this run.
 */
export async function runReminderScan(now: Date = new Date()): Promise<ScanResult> {
  // Only load records that could possibly trip a rule.
  const widest = Math.max(...ALL_RULES.flatMap((rule) => [...rule.thresholds]));
  const until = new Date(now.getTime() + widest * DAY_MS);
  const inWindow = { gte: now, lte: until };

  const [admissions, exchanges, mous] = await Promise.all([
    prisma.studentApplication.findMany({
      where: {
        status: { notIn: ["REJECTED", "WITHDRAWN"] },
        OR: [
          { visaExpiryDate: inWindow },
          { passportExpiryDate: inWindow },
          { exitDate: inWindow },
        ],
      },
      select: INBOUND_SELECT,
    }),
    prisma.inboundExchangeApplication.findMany({
      where: {
        status: { notIn: ["REJECTED", "WITHDRAWN"] },
        OR: [
          { visaExpiryDate: inWindow },
          { passportExpiryDate: inWindow },
          { exitDate: inWindow },
        ],
      },
      select: INBOUND_SELECT,
    }),
    prisma.mou.findMany({
      where: { status: "ACTIVE", expiryDate: inWindow },
      select: {
        id: true,
        title: true,
        expiryDate: true,
        partner: { select: { name: true } },
      },
    }),
  ]);

  // Both registers carry the same expiry columns, so they share every rule.
  const inbound = [
    ...admissions.map((row) => ({ row, entityType: "student_application" })),
    ...exchanges.map((row) => ({ row, entityType: "inbound_exchange_application" })),
  ];

  const subjectsFor = (
    column: "visaExpiryDate" | "passportExpiryDate" | "exitDate",
  ): ExpiringSubject[] =>
    inbound.flatMap(({ row, entityType }) =>
      row[column]
        ? [
            {
              id: row.id,
              entityType,
              name: `${row.firstName} ${row.lastName}`,
              detail: `${row.nationality} national`,
              date: row[column],
            },
          ]
        : [],
    );

  const mouSubjects: ExpiringSubject[] = mous.flatMap((mou) =>
    mou.expiryDate
      ? [
          {
            id: mou.id,
            entityType: "mou",
            name: mou.title,
            detail: `Partner: ${mou.partner.name}`,
            date: mou.expiryDate,
          },
        ]
      : [],
  );

  const batches = [
    await raiseExpiryNotifications(VISA_RULE, subjectsFor("visaExpiryDate"), now),
    await raiseExpiryNotifications(PASSPORT_RULE, subjectsFor("passportExpiryDate"), now),
    await raiseExpiryNotifications(EXIT_RULE, subjectsFor("exitDate"), now),
    await raiseExpiryNotifications(MOU_RULE, mouSubjects, now),
  ];

  const digest = batches.flatMap((batch) => batch.digest);
  const createdIds = batches.flatMap((batch) => batch.ids);

  const emailed = await sendReminderDigest(digest);
  if (emailed && createdIds.length > 0) await markNotificationsEmailed(createdIds);

  console.log(
    `[NOTIFICATIONS] Reminder scan complete — ${digest.length} new, emailed: ${emailed}`,
  );

  return { created: digest.length, emailed };
}
