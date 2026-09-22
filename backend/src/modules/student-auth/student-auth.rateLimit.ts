import rateLimit from "express-rate-limit";

/**
 * Rate limiter for campus / student Google Sign-in and session refresh.
 * Prevents credential stuffing, rapid token requests, and DoS against OAuth verification.
 */
export const studentAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30, // 30 attempts per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: "fail",
    message: "Too many sign-in or refresh attempts. Please try again in a few minutes.",
  },
});
