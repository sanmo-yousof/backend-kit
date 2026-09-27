import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { comparePassword, hashPassword } from "../utils/hashing.js";

const registerValidation = ({ name, email, password }) => {
  const errors = {};
  if (!name) {
    errors.name = "Name is required";
  }
  if (!email) {
    errors.email = "Email is required";
  }
  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }
};




const loginValidation = ({ email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  }
  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }
};

const registerUser = async ({ name, email, password }) => {
  registerValidation({
    name,
    email,
    password,
  });
  
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  loginValidation({
    email,
    password,
  });
  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    throw new AppError("Invalid email", 401);
  }
  const isPasswordMatch = await comparePassword(
    password,
    existingUser.password,
  );
  if (!isPasswordMatch) {
    throw new AppError("Invalid password", 401);
  }

  return existingUser;
};

const getUserResponse = (user) => {
  const userData = user.toObject();
  const { password, ...safeUser } = userData;
  return safeUser;
};

export { registerUser, registerValidation, getUserResponse, loginUser };
