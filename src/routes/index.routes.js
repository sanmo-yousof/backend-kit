import { Router } from "express";
import indexCheck  from "../controllers/index.controller.js";

const router = Router();
router.get("/",indexCheck);

export default router