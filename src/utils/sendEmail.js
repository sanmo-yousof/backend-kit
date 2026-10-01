import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: Number(env.smtpPort),
  secure: false,
  auth: { user: env.smtpUser, pass: env.smtpPass },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({ from: env.mailFrom, to, subject, html });
};


export default sendEmail;