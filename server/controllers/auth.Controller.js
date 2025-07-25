import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json(
          ApiError("User already exists", 400, "Email is already registered")
        );

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    res.status(201).json(
      ApiResponse("User registered successfully", 201, {
        user: { id: user._id, username: user.username, email: user.email },
      })
    );
  } catch (err) {
    res.status(500).json(ApiError("Registration failed", 500, err.message));
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json(ApiError("User not found", 400, "Invalid email or password"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json(
          new ApiError("Invalid credentials", 400, "Password does not match")
        );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json(
      new ApiResponse("Login successful", 200, {
        user: { id: user._id, username: user.username, email: user.email },
        token,
      })
    );
  } catch (err) {
    res.status(500).json(new ApiError("Login failed", 500, err.message));
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Invalidate the token by removing it from the client side
    res.status(200).json(ApiResponse("Logout successful", 200));
  } catch (err) {
    res.status(500).json(ApiError("Logout failed", 500, err.message));
  }
});
export const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json(ApiError("User not found", 404, "No user with this ID"));

    res.json(ApiResponse("User retrieved successfully", 200, { user }));
  } catch (err) {
    res.status(500).json(ApiError("Failed to retrieve user", 500, err.message));
  }
});
export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};
