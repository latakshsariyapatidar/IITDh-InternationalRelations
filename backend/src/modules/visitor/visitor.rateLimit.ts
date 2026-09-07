import rateLimit from "express-rate-limit";

// The visitor form is open to the public, so it gets the same throttle as the
// application form.
export const visitorSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: "fail",
    message: "Too many submissions from this network. Please try again later.",
  },
});
