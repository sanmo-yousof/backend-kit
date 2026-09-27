import {
  getUserResponse,
  loginUser,
  registerUser,
} from "../service/auth.service.js";
import { clearAuthCookie, generateTokenAndSetCookie } from "../utils/token.js";
import { successResponse } from "../utils/response.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUser({
    name,
    email,
    password,
  });

  generateTokenAndSetCookie(user._id, res);
  return successResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: getUserResponse(user),
  });
};



const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUser({
    email,
    password,
  });

  generateTokenAndSetCookie(user._id, res);
  return successResponse(res, {
    statusCode: 200,
    message: "User login successfully",
    data: getUserResponse(user),
  });
};

const logout = async (req,res) => {
  clearAuthCookie(res);
  return successResponse(res,{
    statusCode:200,
    message:"User logout successfully"
  })
}

const profile = async (req, res) => {
  return successResponse(res, {
    statusCode: 200,
    message: "Profile fetched successfully",
    data: getUserResponse(req.user),
  });
};

export { register, login, logout, profile };
