import { Router } from "express";
import { forgotPassword, login, logout, profile, register, resetPasswordController, updateProfile, verifyCode } from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { forgotPasswordLimiter, loginLimiter, verifyLimiter } from "../middlewares/rateLimiter.middleware.js";


const router = Router();

router.post("/register",asyncHandler(register));
router.post("/login",loginLimiter, asyncHandler(login));
router.post("/logout",asyncHandler(logout));

router.post("/forgot-password", forgotPasswordLimiter, asyncHandler(forgotPassword));
router.post("/verify-code",verifyLimiter, asyncHandler(verifyCode));
router.post("/reset-password",verifyLimiter, asyncHandler(resetPasswordController));

router.get("/profile", asyncHandler(authMiddleware()), asyncHandler(profile));
router.patch("/profile/:id", asyncHandler(authMiddleware()), asyncHandler(updateProfile));




export default router;