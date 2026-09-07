// Announcements and opportunities share one rule for "is this live right now":
// it must be switched on, already published, and not past its visibility date.
// Both modules build their Prisma `where` from this so the two can never drift.

export interface VisibilityWindowFilter {
  publishedAt: { lte: Date } | null;
  visibleUntil: { gte: Date } | null;
}

/**
 * Prisma `where` fragment matching rows inside their visibility window.
 * A null `publishedAt` counts as published; a null `visibleUntil` never expires.
 */
export function visibilityWindowWhere(now: Date = new Date()) {
  return {
    OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
    AND: [{ OR: [{ visibleUntil: null }, { visibleUntil: { gte: now } }] }],
  };
}

/** In-memory equivalent, for records already loaded. */
export function isVisibleNow(
  record: { publishedAt: Date | null; visibleUntil: Date | null; isActive?: boolean },
  now: Date = new Date(),
): boolean {
  if (record.isActive === false) return false;
  if (record.publishedAt && record.publishedAt > now) return false;
  if (record.visibleUntil && record.visibleUntil < now) return false;
  return true;
}
