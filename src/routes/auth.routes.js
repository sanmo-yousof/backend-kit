import { Router } from "express";
import { login, logout, profile, register } from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/register",asyncHandler(register));
router.post("/login",asyncHandler(login));
router.post("/logout",asyncHandler(logout));

router.get("/profile", asyncHandler(authMiddleware()), asyncHandler(profile));




export default router;