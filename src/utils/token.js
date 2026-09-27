import jwt from "jsonwebtoken";
import env from "../config/env.js";

const generateTokenAndSetCookie = (userId, res) => {
  const isProduction = env.nodeEnv === "production";
  const token = jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};

const clearAuthCookie = (res) => {
  const isProduction = env.nodeEnv === "production";
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};

export { generateTokenAndSetCookie,clearAuthCookie };
