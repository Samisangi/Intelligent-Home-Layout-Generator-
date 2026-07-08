import User from "../models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { success, failure } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return failure(res, 409, "Email already registered");

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push(refreshToken);
    await user.save();

    return success(res, 201, "Registered successfully", {
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return failure(res, 401, "Invalid credentials");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return failure(res, 401, "Invalid credentials");

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Multi-device support: append rather than overwrite
    user.refreshTokens.push(refreshToken);
    await user.save();

    return success(res, 200, "Login successful", {
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/refresh
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return failure(res, 401, "Refresh token required");

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return failure(res, 403, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return failure(res, 403, "Refresh token not recognized");
    }

    // Rotate: remove old, issue new
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    return success(res, 200, "Token refreshed", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }
    return success(res, 200, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshTokens");
    return success(res, 200, "Profile fetched", { user });
  } catch (err) {
    next(err);
  }
};