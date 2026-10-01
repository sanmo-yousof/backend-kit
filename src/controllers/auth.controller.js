import {
  getUserResponse,
  loginUser,
  registerUser,
  resetPassword,
  sendResetCode,
  updatedUser,
  verifyResetCode,
} from "../service/auth.service.js";
import { clearAuthCookie, generateTokenAndSetCookie } from "../utils/token.js";
import { successResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUser({
    name,
    email,
    password,
  });

  generateTokenAndSetCookie(user, res);
  return successResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: getUserResponse(user),
  });
};

const login = async (req, res) => {
  const { email, password,rememberMe } = req.body;

  const user = await loginUser({
    email,
    password 
  });

  generateTokenAndSetCookie(user, res,rememberMe);
  return successResponse(res, {
    statusCode: 200,
    message: "User login successfully",
    data: getUserResponse(user),
  });
};

const logout = async (req, res) => {
  clearAuthCookie(res);
  return successResponse(res, {
    statusCode: 200,
    message: "User logout successfully",
  });
};

const profile = async (req, res) => {
  return successResponse(res, {
    statusCode: 200,
    message: "Profile fetched successfully",
    data: getUserResponse(req.user),
  });
};

const updateProfile = async (req,res) => {
  const { id } = req.params;
  const authUser = req.user;

  if (authUser.id !== id && authUser.role !== "admin"){
    throw new AppError("You are not authorized to update this user", 403);
  }

  const user = await updatedUser(id, req.body);
  return successResponse(res, {
    statusCode: 200,
    message: "User profile updated successfully",
    data: getUserResponse(user),
  });
}


// password reset 
const forgotPassword = async (req, res) => {
  await sendResetCode(req.body.email);
  return successResponse(res, {
    statusCode: 200,
    message: "If this email exists, a code has been sent",
  });
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const resetToken = await verifyResetCode({ email, code });
  return successResponse(res, {
    statusCode: 200,
    message: "Code verified",
    data: { resetToken },
  });
};

const resetPasswordController = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  await resetPassword({ email, resetToken, newPassword });
  return successResponse(res, {
    statusCode: 200,
    message: "Password reset successfully",
  });
};

export { register, login, logout, profile,forgotPassword,verifyCode,resetPasswordController,updateProfile };
