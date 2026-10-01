import dotenv from "dotenv";
dotenv.config();

const env = {
    nodeEnv:process.env.NODE_ENV || "development",
    port:Number(process.env.PORT)|| 5000,
    mongoUri:process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    smtpHost:process.env.SMTP_HOST,
    smtpPort:process.env.SMTP_PORT,
    smtpUser:process.env.SMTP_USER,
    smtpPass :process.env.SMTP_PASS,
    mailFrom:process.env.MAIL_FROM
};

export default env;