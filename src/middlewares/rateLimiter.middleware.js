// middlewares/rateLimiter.middleware.js
import rateLimit from "express-rate-limit";
import env from "../config/env.js";

const isProduction = env.nodeEnv === "production";

const createLimiter = ({ windowMs, max }) =>
  rateLimit({
    windowMs,
     max: isProduction ? max : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });

// login: 15 min e 10 bar
const loginLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

// forgot-password: 15 min e 5 bar (email bombing rokhte)
const forgotPasswordLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

// verify code ar reset: 15 min e 10 bar
const verifyLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

export { loginLimiter, forgotPasswordLimiter, verifyLimiter };