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

// ---------------------------------------------------------------------------
// Server-enforced visibility for the flag-based content modules.
// ---------------------------------------------------------------------------
//
// Eleven models hide rows behind a boolean: `isPublic` on gallery, downloads,
// events and MOUs, `isActive` on partners, faculty, team, testimonials, FAQs,
// programs and contacts. That flag used to be an *optional query filter*, so a
// caller who simply omitted it saw hidden rows — the public pages only looked
// public because the frontend happened to pass the filter.
//
// Visibility is authorisation, so it belongs on the server. These two helpers
// are the single place that decides it, mounted behind `optionalAuthenticate`:
// an admin bearer token widens the result set, everyone else is pinned to the
// live rows and cannot opt out.

/**
 * Prisma `where` fragment for one visibility flag.
 *
 * Anonymous callers are forced to `flag: true` and the requested filter is
 * ignored. Admins get the filter they asked for, or no constraint at all.
 */
export function visibilityFlagWhere<K extends string>(
  flag: K,
  isAdmin: boolean,
  requested?: boolean,
): Partial<Record<K, boolean>> {
  if (!isAdmin) return { [flag]: true } as Record<K, true>;
  return requested === undefined
    ? {}
    : ({ [flag]: requested } as Record<K, boolean>);
}

/**
 * True when a single fetched row may be shown to this caller. A hidden row is
 * reported as a 404 rather than a 403: the public has no business learning
 * that an id exists at all.
 */
export function canSeeRecord(
  record: Record<string, unknown>,
  flag: string,
  isAdmin: boolean,
): boolean {
  return isAdmin || record[flag] === true;
}
