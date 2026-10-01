import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import  healthCheck  from "./routes/health.routes.js";
import  indexCheck  from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";


const app = express();


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));


app.use("/api/health",healthCheck);
app.use("/",indexCheck);

app.use("/api",authRoutes);



app.use(errorMiddleware);

export default app ;