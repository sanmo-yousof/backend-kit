import { Router } from "express";
import { serverIndex } from "../controllers/index.controller.js";

const router = Router();
router.get("/",serverIndex);

export default router