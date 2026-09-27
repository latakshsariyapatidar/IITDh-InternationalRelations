/**
 * Formats a calendar-day value (date of birth, visit date, MOU date) for display.
 *
 * These columns are DATE in PostgreSQL and arrive as "YYYY-MM-DDT00:00:00.000Z".
 * They must be rendered in UTC: local rendering shows the previous day for any
 * viewer west of UTC.
 *
 * Do NOT use this for timestamps (createdAt, event startDate, deadlines).
 * Those are real moments and should render in the viewer's local time.
 */
export function formatDay(value, locale = 'en-GB') {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(locale, {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
