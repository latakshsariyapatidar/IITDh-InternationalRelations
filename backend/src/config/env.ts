type NodeEnv = "development" | "production" | "test";
type SameSite = "lax" | "strict" | "none";

interface EnvironmentVariables {
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;

  // Browser origins allowed to call this API with credentials. Comma-separated
  // so the public site and the admin panel can be served separately.
  CORS_ORIGIN: string[];

  // How many reverse proxies sit in front of this process. Rate limiting keys
  // on the client IP, so behind nginx this must be set or every request looks
  // like it came from the proxy and one visitor can exhaust everyone's budget.
  TRUST_PROXY: boolean | number | string;

  // Refresh-cookie attributes. `none` is only needed when the frontend is on a
  // genuinely different site (not just a different port or subdomain), and the
  // browser then requires `secure` too.
  COOKIE_SAMESITE: SameSite;
  COOKIE_SECURE: boolean;

  // Signing key for document links in exported spreadsheets. Kept separate
  // from JWT_SECRET so rotating one does not silently invalidate the other.
  EXPORT_LINK_SECRET: string;

  // Public HTTP origin of this API. Signed document links written into exported
  // spreadsheets are absolute, so they need the address a browser can reach.
  PUBLIC_API_BASE_URL: string;

  // How long a document link inside an exported spreadsheet keeps working.
  // In HOURS, not days: the link is a bearer credential for a passport scan
  // that travels by email, so its lifetime is the whole of its security.
  EXPORT_LINK_TTL_HOURS: number;

  // Reminder email. All optional — with no SMTP host configured the
  // expiry scan still records notifications, it just cannot send the digest.
  SMTP_HOST?: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
  IRO_NOTIFICATION_EMAIL?: string;
  REMINDER_CRON: string;
}

function getReqString(key: string): string {
  const value = process.env[key];

  if (value === undefined || value.trim() === "") {
    throw new Error(
      `[env] Missing required environment variable: "${key}"\n` +
        `Make sure "${key}" is defined in your .env file.\n` +
        `See .env.example for the full list of required variables.`,
    );
  }

  return value.trim();
}

function getReqNum(key: string): number {
  const raw = getReqString(key);
  const parsed = parseInt(raw, 10);

  if (isNaN(parsed)) {
    throw new Error(
      `[env] Environment variable "${key}" must be a valid number.\n` +
        `Received: "${raw}"`,
    );
  }

  return parsed;
}

function getOptString(key: string): string | undefined {
  const value = process.env[key];
  return value === undefined || value.trim() === "" ? undefined : value.trim();
}

function getOptNum(key: string, fallback: number): number {
  const raw = getOptString(key);
  if (raw === undefined) return fallback;

  const parsed = parseInt(raw, 10);

  if (isNaN(parsed)) {
    throw new Error(
      `[env] Environment variable "${key}" must be a valid number.\n` +
        `Received: "${raw}"`,
    );
  }

  return parsed;
}

function getOptBool(key: string, fallback: boolean): boolean {
  const raw = getOptString(key)?.toLowerCase();
  if (raw === undefined) return fallback;

  if (raw !== "true" && raw !== "false") {
    throw new Error(
      `[env] Environment variable "${key}" must be "true" or "false".\n` +
        `Received: "${raw}"`,
    );
  }

  return raw === "true";
}

function getOriginList(key: string, fallback: string): string[] {
  const raw = getOptString(key) ?? fallback;
  const origins = raw
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error(`[env] "${key}" must list at least one origin.`);
  }

  return origins;
}

function getSameSite(key: string, fallback: SameSite): SameSite {
  const raw = getOptString(key)?.toLowerCase();
  if (raw === undefined) return fallback;

  if (raw !== "lax" && raw !== "strict" && raw !== "none") {
    throw new Error(
      `[env] "${key}" must be one of: lax, strict, none.\n` +
        `Received: "${raw}"`,
    );
  }

  return raw;
}

/**
 * Express accepts `false`, a hop count, or a list of trusted addresses.
 * `true` is deliberately allowed but flagged: it makes `X-Forwarded-For`
 * fully spoofable, which lets anyone bypass the rate limiters.
 */
function getTrustProxy(): boolean | number | string {
  const raw = getOptString("TRUST_PROXY") ?? "false";

  if (raw === "false") return false;
  if (raw === "true") {
    console.warn(
      '[env] TRUST_PROXY=true trusts every X-Forwarded-For header, so a client ' +
        "can forge its own IP and slip past the rate limiters. Prefer the number " +
        "of proxies in front of this app (usually 1).",
    );
    return true;
  }

  const hops = Number(raw);
  return Number.isInteger(hops) && hops >= 0 ? hops : raw;
}

function getNodeEnv(): NodeEnv {
  const value = getReqString("NODE_ENV");
  const validValues = ["development", "production", "test"] as const;

  if (!validValues.includes(value as NodeEnv)) {
    throw new Error(
      `[env] NODE_ENV must be one of: ${validValues.join(", ")}.\n` +
        `Received: "${value}"`,
    );
  }

  return value as NodeEnv;
}

const MIN_SECRET_LENGTH = 32;

/**
 * Every secret-shaped string that is published somewhere public, and so is not
 * a secret no matter how long it is.
 *
 * The length check alone was not enough, and the gap was not hypothetical: the
 * committed docker-compose.yml carries
 * `JWT_SECRET=${JWT_SECRET:-supersecret_jwt_key_...}` as a *fallback*, so any
 * deploy that forgot to export the real value came up silently signing tokens
 * with a key printed in a public GitHub repository — and it passed the
 * 32-character minimum comfortably. The .env.example placeholder is 33
 * characters and passed too.
 *
 * Compared case-insensitively, since a fallback that differs only in case is
 * no less public.
 */
const PLACEHOLDER_SECRETS = new Set(
  [
    // .env.example
    "some-long-random-secret-string",
    "changeme_in_production",
    "replace-me-openssl-rand-base64-48",
    "choose-a-strong-password-here",
    // docker-compose.yml fallbacks
    "supersecret_jwt_key_that_is_at_least_32_characters_long_12345",
    "Admin@12345678",
    // Common stand-ins people reach for
    "changeme",
    "change-me",
    "secret",
    "password",
    "your-secret-key",
    "development-secret",
  ].map((value) => value.toLowerCase()),
);

/**
 * Rejects a string with almost no variety in it — "aaaa...", "12341234...",
 * "xxxxxxxx". Long enough to pass the length check, trivial to guess.
 */
function looksLowEntropy(value: string): boolean {
  return new Set(value).size < 8;
}

/**
 * A signing key that is actually secret: long enough to resist offline
 * guessing, not a value published in this repository, and not a keyboard
 * pattern.
 */
function getSecret(key: string): string {
  const value = getReqString(key);

  if (value.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `[env] "${key}" must be at least ${MIN_SECRET_LENGTH} characters ` +
        `(got ${value.length}).\n` +
        "Generate one with: openssl rand -base64 48",
    );
  }

  if (PLACEHOLDER_SECRETS.has(value.toLowerCase())) {
    throw new Error(
      `[env] "${key}" is a placeholder value published in this repository ` +
        "(.env.example or docker-compose.yml), so it is not secret.\n" +
        "Generate a real one with: openssl rand -base64 48",
    );
  }

  if (looksLowEntropy(value)) {
    throw new Error(
      `[env] "${key}" is long but has almost no variety in it, so it is ` +
        "cheap to guess.\nGenerate a real one with: openssl rand -base64 48",
    );
  }

  return value;
}

const NODE_ENV = getNodeEnv();
const PORT = getReqNum("PORT");
const IS_PRODUCTION = NODE_ENV === "production";

const COOKIE_SAMESITE = getSameSite("COOKIE_SAMESITE", "lax");
const COOKIE_SECURE = getOptBool("COOKIE_SECURE", IS_PRODUCTION);

// A browser silently drops a `SameSite=None` cookie that is not also `Secure`,
// which would look like "login works but the session never persists".
if (COOKIE_SAMESITE === "none" && !COOKIE_SECURE) {
  throw new Error(
    '[env] COOKIE_SAMESITE="none" requires COOKIE_SECURE=true — browsers reject ' +
      "the cookie otherwise. This combination also needs the API served over HTTPS.",
  );
}

const JWT_SECRET = getSecret("JWT_SECRET");

/**
 * Export-link lifetime, in hours.
 *
 * It used to be EXPORT_LINK_TTL_DAYS, defaulting to 30. A spreadsheet of
 * inbound applicants is emailed around the office; each row carries an
 * absolute, signed URL to that applicant's passport copy, and anyone holding
 * the sheet — or any mailbox it was forwarded to, or any backup of one — could
 * open those documents for a month with no sign-in. Two days is long enough
 * for an office to work through a sheet.
 *
 * The old variable is still read so an existing deployment does not silently
 * change behaviour on upgrade, and either way the value is capped: nothing
 * here should hand out a month-long credential.
 */
const MAX_EXPORT_LINK_TTL_HOURS = 24 * 7;

function getExportLinkTtlHours(): number {
  const legacyDays = getOptString("EXPORT_LINK_TTL_DAYS");
  const requested =
    legacyDays !== undefined
      ? getOptNum("EXPORT_LINK_TTL_DAYS", 2) * 24
      : getOptNum("EXPORT_LINK_TTL_HOURS", 48);

  if (requested < 1) {
    throw new Error('[env] "EXPORT_LINK_TTL_HOURS" must be at least 1 hour.');
  }

  if (requested > MAX_EXPORT_LINK_TTL_HOURS) {
    console.warn(
      `[env] Export link lifetime of ${requested}h exceeds the ` +
        `${MAX_EXPORT_LINK_TTL_HOURS}h ceiling and has been capped. These links ` +
        "open applicant passport scans with no sign-in, so they are kept short.",
    );
    return MAX_EXPORT_LINK_TTL_HOURS;
  }

  if (legacyDays !== undefined) {
    console.warn(
      "[env] EXPORT_LINK_TTL_DAYS is deprecated; use EXPORT_LINK_TTL_HOURS.",
    );
  }

  return requested;
}

const EXPORT_LINK_TTL_HOURS = getExportLinkTtlHours();

const EXPORT_LINK_SECRET = getOptString("EXPORT_LINK_SECRET");

// Falling back to JWT_SECRET keeps existing deployments working, but it means
// one leaked value forges both sessions and document links, and rotating
// either breaks the other.
if (!EXPORT_LINK_SECRET && NODE_ENV === "production") {
  console.warn(
    "[env] EXPORT_LINK_SECRET is unset, so document links are signed with " +
      "JWT_SECRET. Set a separate value: openssl rand -base64 48",
  );
}

export const env: Readonly<EnvironmentVariables> = Object.freeze({
  NODE_ENV,
  PORT,
  DATABASE_URL: getReqString("DATABASE_URL"),
  JWT_SECRET,
  GOOGLE_CLIENT_ID: getReqString("GOOGLE_CLIENT_ID"),

  CORS_ORIGIN: getOriginList("CORS_ORIGIN", "http://localhost:5173"),
  TRUST_PROXY: getTrustProxy(),
  COOKIE_SAMESITE,
  COOKIE_SECURE,

  EXPORT_LINK_SECRET: EXPORT_LINK_SECRET ?? JWT_SECRET,

  PUBLIC_API_BASE_URL: (
    getOptString("PUBLIC_API_BASE_URL") ?? `http://localhost:${PORT}`
  ).replace(/\/+$/, ""),
  EXPORT_LINK_TTL_HOURS: EXPORT_LINK_TTL_HOURS,

  SMTP_HOST: getOptString("SMTP_HOST"),
  SMTP_PORT: getOptNum("SMTP_PORT", 587),
  SMTP_SECURE: getOptBool("SMTP_SECURE", false),
  SMTP_USER: getOptString("SMTP_USER"),
  SMTP_PASS: getOptString("SMTP_PASS"),
  SMTP_FROM: getOptString("SMTP_FROM"),
  IRO_NOTIFICATION_EMAIL: getOptString("IRO_NOTIFICATION_EMAIL"),
  REMINDER_CRON: getOptString("REMINDER_CRON") ?? "0 7 * * *",
});

console.log(
  `[env] Environment loaded: NODE_ENV=${env.NODE_ENV} | PORT=${env.PORT}`,
);
