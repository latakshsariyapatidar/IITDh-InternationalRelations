import rateLimit from "express-rate-limit";

export const applicationSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: "fail",
    message: "Too many applications submitted from this network. Please try again later.",
  },
});
