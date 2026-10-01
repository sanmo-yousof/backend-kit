import crypto from "crypto";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { comparePassword, hashPassword } from "../utils/hashing.js";
import sendEmail from "../utils/sendEmail.js";
import PasswordReset from "../models/passwordReset.model.js";
import requireFields from "../utils/requireFields.js";



const checkPasswordLength = (password, field = "password") => {
  if (password.length < 6) {
    throw new AppError("Validation failed", 400, {
      [field]: "Password must be at least 6 characters",
    });
  }
};

// register validation

// const registerValidation = ({ name, email, password }) => {
//   const errors = {};
//   if (!name) {
//     errors.name = "Name is required";
//   }
//   if (!email) {
//     errors.email = "Email is required";
//   }
//   if (!password) {
//     errors.password = "Password is required";
//   } else if (password.length < 6) {
//     errors.password = "Password must be at least 6 characters";
//   }

//   if (Object.keys(errors).length > 0) {
//     throw new AppError("Validation failed", 400, errors);
//   }
// };

// login validation

// const loginValidation = ({ email, password }) => {
//   const errors = {};

//   if (!email) {
//     errors.email = "Email is required";
//   }
//   if (!password) {
//     errors.password = "Password is required";
//   }

//   if (Object.keys(errors).length > 0) {
//     throw new AppError("Validation failed", 400, errors);
//   }
// };

// register user

const registerUser = async ({ name, email, password }) => {
  // registerValidation({ name, email, password });

  requireFields({ name, email, password });
  checkPasswordLength(password);

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    provider: "local",
  });

  return user;
};

// login user

const loginUser = async ({ email, password }) => {
  // loginValidation({
  //   email,
  //   password,
  // });

  requireFields({ email, password });
  const existingUser = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  if (!existingUser || !existingUser.password) {
    throw new AppError("Invalid email or password", 401);
  }
  const isPasswordMatch = await comparePassword(
    password,
    existingUser.password,
  );
  if (!isPasswordMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  return existingUser;
};

// auth user

const getUserResponse = (user) => {
  const userData = user.toObject();
  const { password, ...safeUser } = userData;
  return safeUser;
};

// update user

const ALLOWED_FIELDS = ["name", "profileImage"];

const updatedUser = async (id, updateData) => {
  const data = {};
  for (const key of ALLOWED_FIELDS) {
    if (updateData[key] !== undefined) data[key] = updateData[key];
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

// reset password
// send code
const hashCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

const TEN_MIN = 10 * 60 * 1000;
const normalize = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const sendResetCode = async (rawEmail) => {
  const email = normalize(rawEmail);
  requireFields({ email });

  const user = await User.findOne({ email });
  if (!user) return;

  const code = crypto.randomInt(100000, 1000000).toString();

  await PasswordReset.findOneAndUpdate(
    { email },
    {
      $set: {
        codeHash: hashCode(code),
        attempts: 0,
        expiresAt: new Date(Date.now() + TEN_MIN),
      },
      $unset: { resetTokenHash: "" },
    },
    { upsert: true },
  );

  await sendEmail({
    to: email,
    subject: "Your password reset code",
    html: `<p>Hi ${user.name},</p>
           <p>Your password reset code is:</p>
           <h2 style="letter-spacing:4px">${code}</h2>
           <p>This code expires in 10 minutes.</p>`,
  });
};

// verify code

const verifyResetCode = async ({ email: rawEmail, code }) => {
  const email = normalize(rawEmail);
  requireFields({ email, code });
  const record = await PasswordReset.findOne({ email });

  if (!record || !record.codeHash || record.expiresAt < Date.now()) {
    throw new AppError("Invalid or expired code", 400);
  }
  if (record.attempts >= 5) {
    throw new AppError("Too many attempts. Request a new code", 429);
  }
  if (record.codeHash !== hashCode(String(code))) {
    await PasswordReset.updateOne({ email }, { $inc: { attempts: 1 } });
    throw new AppError("Invalid or expired code", 400);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  record.codeHash = undefined;
  record.resetTokenHash = hashCode(resetToken);
  record.expiresAt = new Date(Date.now() + TEN_MIN);
  await record.save();

  return resetToken;
};

// reset password
const resetPassword = async ({ email: rawEmail, resetToken, newPassword }) => {
  const email = normalize(rawEmail);
  requireFields({ email, resetToken, newPassword });
  checkPasswordLength(newPassword, "newPassword");

  const record = await PasswordReset.findOne({ email });
  if (
    !record ||
    !resetToken ||
    !record.resetTokenHash ||
    record.expiresAt < Date.now() ||
    record.resetTokenHash !== hashCode(String(resetToken))
  ) {
    throw new AppError("Reset session expired. Please try again", 400);
  }

  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 404);

  user.password = await hashPassword(newPassword);
  await user.save({ validateBeforeSave: false });
  await PasswordReset.deleteOne({ email });
};

export {
  registerUser,
  getUserResponse,
  loginUser,
  sendResetCode,
  verifyResetCode,
  resetPassword,
  updatedUser,
};
