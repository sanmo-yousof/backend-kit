import express from "express";
import cors from "cors";

import { healthCheck } from "./controllers/health.controller.js";
import { indexCheck } from "./controllers/index.controller.js";

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/v1/health",healthCheck);
app.use("/",indexCheck);


export default app ;