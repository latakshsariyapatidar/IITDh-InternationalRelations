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
  EXPORT_LINK_TTL_DAYS: number;

  // Reminder email (Part 8). All optional — with no SMTP host configured the
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

// Values shipped in .env.example. Fine while developing; a production process
// holding one of these is running with a publicly known key.
const PLACEHOLDER_SECRETS = new Set([
  "some-long-random-secret-string",
  "changeme_in_production",
]);

/**
 * A signing key that is actually secret: long enough to resist offline
 * guessing, and not the value copied out of the example file.
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

  if (PLACEHOLDER_SECRETS.has(value)) {
    throw new Error(
      `[env] "${key}" is still the placeholder from .env.example. ` +
        "Generate a real one with: openssl rand -base64 48",
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

  // Falls back to JWT_SECRET so existing deployments keep working; set it
  // explicitly to decouple the two.
  EXPORT_LINK_SECRET: getOptString("EXPORT_LINK_SECRET") ?? JWT_SECRET,

  PUBLIC_API_BASE_URL: (
    getOptString("PUBLIC_API_BASE_URL") ?? `http://localhost:${PORT}`
  ).replace(/\/+$/, ""),
  EXPORT_LINK_TTL_DAYS: getOptNum("EXPORT_LINK_TTL_DAYS", 30),

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
