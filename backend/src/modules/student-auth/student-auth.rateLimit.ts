import rateLimit from "express-rate-limit";

/**
 * The Google sign-in endpoint had no limiter of its own.
 *
 * It is unauthenticated and every call does real work: an outbound HTTPS
 * request to Google to verify the ID token, then an upsert and a faculty
 * lookup. That makes it the cheapest way to make this server do expensive
 * things, regardless of whether any token ever verifies.
 */
export const googleSignInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: "fail",
    message: "Too many sign-in attempts. Please try again in a few minutes.",
  },
});

/**
 * Refresh is a database lookup against a hash, so it is cheap — but an
 * unlimited one is a way to probe for valid token values, and a client stuck
 * in a refresh loop should be slowed down rather than served.
 */
export const campusRefreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: "fail",
    message: "Too many session refreshes. Please try again shortly.",
  },
});
