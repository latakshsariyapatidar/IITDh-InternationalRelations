import rateLimit from "express-rate-limit";

/**
 * Password guessing against the admin accounts. Tighter than the public form
 * limiters because the population is small and known: there is no legitimate
 * reason for one address to try ten passwords in a quarter of an hour.
 *
 * Successful sign-ins are not counted, so an admin who mistypes a few times and
 * then gets in keeps a clean budget.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
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
 * Refresh was unlimited. It is cheap per call, but an unbounded endpoint that
 * accepts a secret and says whether it was valid is a place to guess, and a
 * frontend stuck in a refresh loop should be throttled rather than served.
 *
 * Set well above what a working session needs: a 15-minute access token means
 * roughly four refreshes an hour per tab.
 */
export const refreshLimiter = rateLimit({
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
