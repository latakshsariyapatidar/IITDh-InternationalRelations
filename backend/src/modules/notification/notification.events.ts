import { createNotificationIfNew } from "./notification.repository.js";

// Submission hooks. These are deliberately fire-and-forget: an applicant's
// submission must succeed even if the notification write fails, so every
// helper swallows its own errors and callers invoke them with `void`.

function record(promise: Promise<unknown>, context: string): void {
  promise.catch((err) => {
    console.error(`[NOTIFICATIONS] Failed to record ${context}:`, err);
  });
}

export function notifyNewInboundApplication(application: {
  id: string;
  name: string;
  nationality: string;
  programAppliedFor: string;
}): void {
  record(
    createNotificationIfNew({
      type: "NEW_INBOUND_APPLICATION",
      severity: "INFO",
      title: `New admission application: ${application.name}`,
      message: `${application.nationality} national applied for ${application.programAppliedFor}.`,
      entityType: "student_application",
      entityId: application.id,
      dedupeKey: `NEW_INBOUND_APPLICATION:${application.id}`,
    }),
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
    createNotificationIfNew({
      type: "NEW_EXCHANGE_APPLICATION",
      severity: "INFO",
      title: `New exchange application: ${application.name}`,
      message: `${application.nationality} national from ${application.homeUniversity}.`,
      entityType: "inbound_exchange_application",
      entityId: application.id,
      dedupeKey: `NEW_EXCHANGE_APPLICATION:${application.id}`,
    }),
    "a new exchange application",
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
