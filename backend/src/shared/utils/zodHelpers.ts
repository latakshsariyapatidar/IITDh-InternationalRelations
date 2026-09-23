import { z } from "zod";

// Shared parsing primitives for the two places where wire data is not the type
// it looks like: booleans that arrive as strings, and strings that look like
// URLs but are not safe to put in an href.

// ---------------------------------------------------------------------------
// Booleans off the wire
// ---------------------------------------------------------------------------
//
// `z.coerce.boolean()` is not a parser, it is a JavaScript cast: it runs
// `Boolean(value)`, and `Boolean("false") === true`. Query strings are always
// strings, and so are multipart bodies — multer, not `express.json`, parses
// those, and it has no types to work with. So every checkbox an applicant
// *unticked* arrived as the string "false" and was stored as true.
//
// These helpers read the string instead of casting it.

const TRUE_TOKENS = new Set(["true", "1", "yes", "on"]);
const FALSE_TOKENS = new Set(["false", "0", "no", "off"]);

function readBoolean(value: unknown): unknown {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return value;

  const token = value.trim().toLowerCase();
  if (TRUE_TOKENS.has(token)) return true;
  if (FALSE_TOKENS.has(token)) return false;

  // Anything else is left alone so the inner schema rejects it with a proper
  // validation error rather than being silently coerced to true.
  return value;
}

/**
 * An optional filter flag on a query string. An absent or empty value means
 * "no filter", not `false`.
 */
export const queryBoolean = () =>
  z.preprocess(
    (value) => (value === "" ? undefined : readBoolean(value)),
    z.boolean().optional(),
  );

/**
 * A required flag on a submitted form, including multipart bodies where every
 * field arrives as a string. An empty value falls back to the default, which
 * is what an unchecked HTML checkbox produces.
 */
export const formBoolean = (defaultValue: boolean) =>
  z.preprocess(
    (value) =>
      value === undefined || value === null || value === ""
        ? defaultValue
        : readBoolean(value),
    z.boolean(),
  );

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
//
// The allowed values for a column were written out twice: once in
// schema.prisma, once by hand in a Zod schema. They drifted, which is the only
// thing hand-copied lists ever do.
//
// The database accepted four partner types and the API accepted two, so the
// CONSORTIUM and NETWORK partners the seed creates on every deploy could not
// be created through the API — and an admin opening one of them in the panel
// got a 400 on a field they had not touched, because the edit form sends the
// stored type back. ContactType had the same split, six values against four.
//
// Prisma already generates the list. Deriving from it means the two cannot
// disagree again: add a value to schema.prisma, run `db:generate`, and the API
// accepts it.

/**
 * A Zod enum built from Prisma's generated enum object, so the schema file is
 * the single source of truth for what the column accepts.
 */
export const prismaEnum = <T extends Record<string, string>>(generated: T) =>
  z.enum(Object.values(generated) as [T[keyof T], ...T[keyof T][]]);

// ---------------------------------------------------------------------------
// Calendar days
// ---------------------------------------------------------------------------
//
// A date of birth is not a moment in time. Nobody is born at midnight UTC.
// Neither is a passport expiry, a visa expiry, a joining date or the day a
// delegation arrives — those are *calendar days*, and a calendar day has no
// time and no timezone.
//
// `z.coerce.date()` produces a full instant, which then moves depending on
// where you read it from. "2000-01-01" became 2000-01-01T00:00:00Z, and a
// reader west of UTC saw 31 December 1999. India is ahead of UTC, so the
// office never noticed, but a partner university in Europe or North America
// reading an exported spreadsheet saw the wrong day.
//
// These columns are `@db.Date` in Postgres now, and this parser pins the value
// to UTC midnight of the day the applicant actually typed, so nothing
// downstream can shift it.

const YYYY_MM_DD = /^(\d{4})-(\d{2})-(\d{2})$/;

function toCalendarDay(value: unknown): unknown {
  if (typeof value === "string") {
    const match = YYYY_MM_DD.exec(value.trim());

    // The normal case: <input type="date"> and every form in this API send
    // exactly this. Build the day directly so no timezone is ever consulted.
    if (match) {
      const [, year, month, day] = match;
      return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    }
  }

  // A full timestamp, from an older client or a seed script. Take the day it
  // names in UTC and drop the time.
  const parsed = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return value;

  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate(),
    ),
  );
}

/** A calendar day, normalised to UTC midnight. For `@db.Date` columns. */
export const calendarDate = () => z.preprocess(toCalendarDay, z.date());

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------
//
// `z.string().url()` answers "is this parseable as a URL", which is not the
// question. `javascript:alert(document.cookie)` and
// `data:text/html;base64,...` both parse. Both are accepted by the WHATWG URL
// parser and both execute when a browser follows them out of an href — which
// is exactly what the site does with a partner website, a faculty redirect or
// an opportunity attachment.
//
// So every link field states the schemes it accepts instead.

/** An absolute http(s) URL with a real hostname. Nothing else parses. */
export const httpUrl = (max = 500) =>
  z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain,
      error: "Must be a valid http(s) link",
    })
    .max(max);

/**
 * An http(s) URL *or* a site-relative path, for fields that may hold either an
 * external link or something this API uploaded, e.g. "/uploads/partners/x.png".
 *
 * A leading "//" is rejected explicitly: browsers read it as a
 * protocol-relative absolute URL, so it would escape the site while looking
 * like a local path.
 */
export const httpUrlOrPath = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(
      (value) =>
        /^https?:\/\/[^/\\]/i.test(value) || /^\/(?![/\\])/.test(value),
      { error: "Must be an http(s) link or a path beginning with /" },
    );

// ---------------------------------------------------------------------------
// Clearing a field
// ---------------------------------------------------------------------------
//
// An admin who empties a text box and saves means "remove this value". That
// has to reach Prisma as `null`, because `undefined` makes Prisma skip the
// column entirely — the old value stays and the admin gets a 200 saying it
// worked.
//
// Getting this wrong is worse than rejecting the request: a silent no-op looks
// like success. So an empty box on an optional field means null, explicitly.
//
// Required fields are deliberately NOT clearable. A faculty member with no
// redirect URL, or a gallery image with no image, is not a state the site can
// render, so those still reject an empty value.

/** `""`, whitespace, and `null` all mean "clear this column". */
const emptyToNull = (value: unknown): unknown =>
  value === null || (typeof value === "string" && value.trim() === "")
    ? null
    : value;

/** An optional http(s) link the admin can also clear by emptying the box. */
export const clearableHttpUrl = (max = 500) =>
  z.preprocess(
    (value) => (emptyToNull(value) === null ? null : normaliseUrlInput(value)),
    httpUrl(max).nullish(),
  );

/** An optional link-or-path the admin can also clear by emptying the box. */
export const clearableHttpUrlOrPath = (max = 500) =>
  z.preprocess(emptyToNull, httpUrlOrPath(max).nullish());

/** An optional calendar day the admin can also clear by emptying the box. */
export const clearableCalendarDate = () =>
  z.preprocess(
    (value) => (emptyToNull(value) === null ? null : toCalendarDay(value)),
    z.date().nullish(),
  );

/**
 * Normalises what an admin actually types into a link box — "example.org"
 * rather than "https://example.org" — and treats a cleared box as absent.
 * Pair with `httpUrl` as the inner schema.
 */
export const normaliseUrlInput = (value: unknown): unknown => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) || trimmed.startsWith("//")
    ? trimmed
    : `https://${trimmed}`;
};

// ---------------------------------------------------------------------------
// Update schemas
// ---------------------------------------------------------------------------
//
// `createSchema.partial()` does NOT do what an update schema needs. It makes
// every key optional, but it leaves each field's `.default()` in place, and a
// default fires precisely when a key is absent. So a PATCH that says only
// `{ "name": "New name" }` came out of validation carrying every default in
// the schema, and those were then written to the row.
//
// Concretely, on this API that meant editing a hidden gallery image's title
// republished it (`isPublic` defaulted back to true), editing an event reset
// its category to OTHER, and editing a deactivated partner reactivated it.
// After visibility became server-enforced, that turned an ordinary edit into a
// way to un-hide content by accident.
//
// Stripping the defaults is what makes "absent" mean "leave this column
// alone", which is what PATCH means.

type AnyZodType = z.ZodType<unknown, unknown>;

function stripDefault(field: AnyZodType): AnyZodType {
  let current = field;

  // `.default()` can be layered (and `.prefault()` wraps the same way), so
  // unwrap until there is nothing left to unwrap.
  while (current instanceof z.ZodDefault || current instanceof z.ZodPrefault) {
    current = current.def.innerType as AnyZodType;
  }

  return current;
}

/**
 * The PATCH counterpart of a create schema: every field optional, and no field
 * inventing a value for itself when the caller left it out.
 *
 * The declared return type keeps each key and its value type, so
 * `z.infer<typeof updateXSchema>` stays a checked object rather than
 * collapsing to an index signature. Stripping a `.default()` does not change a
 * field's output type — only whether it produces one when absent — so
 * `ZodOptional<Shape[K]>` describes the result exactly.
 */
export function partialForUpdate<Shape extends z.ZodRawShape>(
  schema: z.ZodObject<Shape>,
): z.ZodObject<{ [K in keyof Shape]: z.ZodOptional<Shape[K]> }> {
  const shape = Object.fromEntries(
    Object.entries(schema.shape as unknown as Record<string, AnyZodType>).map(
      ([key, field]) => [key, stripDefault(field).optional()],
    ),
  );

  return z.object(shape) as unknown as z.ZodObject<{
    [K in keyof Shape]: z.ZodOptional<Shape[K]>;
  }>;
}
