import {
  createNotificationIfNew,
  markNotificationsEmailed,
  type NewNotification,
} from "./notification.repository.js";
import { sendApplicationAlert, type ApplicationAlert, type Desk } from "./notification.mailer.js";

// Submission hooks. These are deliberately fire-and-forget: an applicant's
// submission must succeed even if the notification write or email fails, so
// every helper swallows its own errors and callers invoke them with `void`.

function record(promise: Promise<unknown>, context: string): void {
  promise.catch((err) => {
    console.error(`[NOTIFICATIONS] Failed to record ${context}:`, err);
  });
}

/**
 * Stores the notification, then emails it to its desk and the IRO office. A
 * notification that already existed was emailed when it was first raised.
 */
async function recordAndEmail(
  notification: NewNotification,
  desk: Desk,
  details: ApplicationAlert["details"],
): Promise<void> {
  const created = await createNotificationIfNew(notification);
  if (!created) return;

  const emailed = await sendApplicationAlert(desk, { title: notification.title, details });
  if (emailed) await markNotificationsEmailed([created.id]);
}

/** "SEMESTER_EXCHANGE" → "Semester exchange". */
const humanize = (value: string): string => {
  const words = value.replace(/_/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export function notifyNewInboundApplication(application: {
  id: string;
  name: string;
  nationality: string;
  programAppliedFor: string;
}): void {
  record(
    recordAndEmail(
      {
        type: "NEW_INBOUND_APPLICATION",
        severity: "INFO",
        title: `New admission application: ${application.name}`,
        message: `${application.nationality} national applied for ${application.programAppliedFor}.`,
        entityType: "student_application",
        entityId: application.id,
        dedupeKey: `NEW_INBOUND_APPLICATION:${application.id}`,
      },
      "INBOUND",
      [
        ["Applicant", application.name],
        ["Nationality", application.nationality],
        ["Program applied for", application.programAppliedFor],
      ],
    ),
    "a new admission application",
  );
}

export function notifyNewExchangeApplication(application: {
  id: string;
  name: string;
  nationality: string;
  homeUniversity: string;
}): void {
  record(
    recordAndEmail(
      {
        type: "NEW_EXCHANGE_APPLICATION",
        severity: "INFO",
        title: `New exchange application: ${application.name}`,
        message: `${application.nationality} national from ${application.homeUniversity}.`,
        entityType: "inbound_exchange_application",
        entityId: application.id,
        dedupeKey: `NEW_EXCHANGE_APPLICATION:${application.id}`,
      },
      "INBOUND",
      [
        ["Applicant", application.name],
        ["Nationality", application.nationality],
        ["Home university", application.homeUniversity],
      ],
    ),
    "a new exchange application",
  );
}

/**
 * Outbound applications have no admin-panel notification type, so this only
 * emails the outbound desk and the IRO office.
 */
export function notifyNewOutboundApplication(application: {
  name: string;
  rollNumber: string;
  branch: string;
  partnerName: string;
  programType: string;
  intendedSemester: string;
}): void {
  record(
    sendApplicationAlert("OUTBOUND", {
      title: `New outbound application: ${application.name}`,
      details: [
        ["Student", application.name],
        ["Roll number", application.rollNumber],
        ["Branch", application.branch],
        ["Partner institution", application.partnerName],
        ["Program type", humanize(application.programType)],
        ["Intended semester", application.intendedSemester],
      ],
    }),
    "a new outbound application alert",
  );
}

export function notifyNewVisitor(visitor: {
  id: string;
  fullName: string;
  organisation: string;
  country: string;
  visitFrom: Date;
}): void {
  record(
    createNotificationIfNew({
      type: "NEW_VISITOR",
      severity: "INFO",
      title: `New visitor registration: ${visitor.fullName}`,
      message:
        `${visitor.organisation}, ${visitor.country} — ` +
        `visit from ${visitor.visitFrom.toISOString().slice(0, 10)}.`,
      entityType: "visitor",
      entityId: visitor.id,
      dueDate: visitor.visitFrom,
      dedupeKey: `NEW_VISITOR:${visitor.id}`,
    }),
    "a new visitor registration",
  );
}
