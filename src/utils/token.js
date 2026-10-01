import jwt from "jsonwebtoken";
import env from "../config/env.js";

const generateTokenAndSetCookie = (user, res, rememberMe = false) => {
  const isProduction = env.nodeEnv === "production";

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: rememberMe ? "15d" : "1d",
    },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  if (rememberMe) {
    cookieOptions.maxAge = 15 * 24 * 60 * 60 * 1000;
  }

  res.cookie("jwt", token, cookieOptions);
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

export { generateTokenAndSetCookie, clearAuthCookie };
