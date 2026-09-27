import jwt from 'jsonwebtoken'
import User from "../models/user.model.js";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

const authMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
      throw new AppError("Unauthorized", 401);
    }
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      throw new AppError("Forbidden", 403);
    }
    req.user = user;
    next();
  };
};

export default authMiddleware;
