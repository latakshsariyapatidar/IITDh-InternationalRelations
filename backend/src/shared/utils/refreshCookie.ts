import type { CookieOptions } from "express";
import { env } from "../../config/env.js";

/** How long a refresh token — and the cookie carrying it — stays valid. */
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Attributes for the refresh cookie, shared by the admin and campus sign-ins.
 *
 * `maxAge`, never an absolute `expires`. An `expires` date computed here would
 * be evaluated once when this module is first imported, so every session issued
 * afterwards would be short by however long the process had been running — and
 * after a week of uptime the server would hand out cookies that had already
 * expired, breaking sign-in until someone restarted it.
 */
export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAMESITE,
  maxAge: REFRESH_TOKEN_TTL_MS,
  path: "/",
};

/**
 * The same attributes without the lifetime. A browser only drops a cookie when
 * the clearing response matches its path, and (for `SameSite=None; Secure`)
 * its security attributes — so clearing with just `{ path }` can leave the
 * cookie in place and the user still signed in.
 */
export const CLEAR_REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAMESITE,
  path: "/",
};
