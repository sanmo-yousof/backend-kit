import dotenv from "dotenv";
dotenv.config();

const env = {
    nodeEnv:process.env.NODE_ENV || "developemnt",
    port:Number(process.env.PORT)|| 5000,
    mongoUri:process.env.MONGODB_URI,
}

export default env;