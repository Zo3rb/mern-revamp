import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
