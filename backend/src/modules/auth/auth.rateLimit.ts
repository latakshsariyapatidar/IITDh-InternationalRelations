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
