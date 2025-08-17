import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

import User from "../models/User.model.js";
import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from "../utils/generateToken.js";
import { actionLogger } from "../utils/logger.js";
import { sendMail } from "../utils/mail.js";

// @desc    Register new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      data: errors.array(),
    });
  }

  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
      data: null,
    });
  }

  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  // Generate OTP and expiry
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const otpExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  user.verifyOtp = otp;
  user.verifyOtpExpireAt = otpExpire;
  user.isVerified = false;
  await user.save();

  // Sedning welcome mail
  await sendMail({
    to: user.email,
    subject: "Welcome to MERN Revamp! Please verify your account",
    template: "welcome",
    context: { username: user.username, otp },
  });

  // Log registration action
  actionLogger.info({
    user: user._id,
    action: "register",
    impact: `User '${username}' registered with email '${email}'`,
    details: { username, email },
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      data: errors.array(),
    });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
      data: null,
    });
  }

  // Update lastLogin and sessions
  user.lastLogin = new Date();
  user.sessions = user.sessions || [];
  user.sessions.push({
    loginAt: new Date(),
    ip: req.ip || req.headers["x-forwarded-for"] || "",
    userAgent: req.headers["user-agent"] || "",
  });
  await user.save();

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  // Log login action
  actionLogger.info({
    user: user._id,
    action: "login",
    impact: `User '${user.username}' logged in`,
    details: { email },
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
});

// @desc    Verify User
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyUserOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User not found", data: null });
  }
  if (user.isVerified) {
    return res
      .status(400)
      .json({ success: false, message: "User already verified", data: null });
  }
  if (
    !user.verifyOtp ||
    user.verifyOtp !== otp ||
    !user.verifyOtpExpireAt ||
    user.verifyOtpExpireAt < new Date()
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP", data: null });
  }

  user.isVerified = true;
  user.verifyOtp = "";
  user.verifyOtpExpireAt = null;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "User verified successfully", data: null });
});

// @desc    Request OTP for Email Verification
// @route   POST /api/users/resend-otp
// @access  Public
export const resendVerificationOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User not found", data: null });
  }
  if (user.isVerified) {
    return res
      .status(400)
      .json({ success: false, message: "User already verified", data: null });
  }

  // Generate new OTP and expiry
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.verifyOtp = otp;
  user.verifyOtpExpireAt = otpExpire;
  await user.save();

  await sendMail({
    to: user.email,
    subject: "Your new verification code",
    template: "welcome",
    context: { username: user.username, otp },
  });

  res
    .status(200)
    .json({ success: true, message: "Verification OTP resent", data: null });
});

// @desc    Request password reset (forgot password)
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  }

  // Generate OTP and expiry for password reset
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpireAt = otpExpire;
  await user.save();

  // Send reset email
  await sendMail({
    to: user.email,
    subject: "Password Reset Request",
    template: "reset-password",
    context: { username: user.username, otp },
  });

  // Log action
  actionLogger.info({
    user: user._id,
    action: "forgot_password",
    impact: `Password reset OTP sent to '${user.email}'`,
    details: { email: user.email },
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: "Password reset OTP sent to your email",
    data: null,
  });
});

// @desc    Reset password using OTP
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  }

  if (
    !user.resetPasswordOtp ||
    user.resetPasswordOtp !== otp ||
    !user.resetPasswordOtpExpireAt ||
    user.resetPasswordOtpExpireAt < new Date()
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
      data: null,
    });
  }

  user.password = newPassword;
  user.resetPasswordOtp = "";
  user.resetPasswordOtpExpireAt = null;
  await user.save();

  // Log action
  actionLogger.info({
    user: user._id,
    action: "reset_password",
    impact: `User '${user.username}' reset their password`,
    details: { email: user.email },
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
    data: null,
  });
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  // Log logout action (if user info is available in req.user, use it; otherwise, log as anonymous)
  actionLogger.info({
    user: req.user?._id || "anonymous",
    action: "logout",
    impact: `User logged out`,
    details: {},
    timestamp: new Date().toISOString(),
  });

  clearTokenCookie(res);
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    message: "Fetched current user profile",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @desc    Update current user profile
// @route   PATCH /api/users/me
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  }

  // Update fields if provided
  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;

  // Handle avatar upload
  if (req.file) {
    user.avatar = `/api/uploads/avatars/${req.file.filename}`;
  }

  // Handle password change
  if (req.body.currentPassword && req.body.newPassword) {
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
        data: null,
      });
    }
    user.password = req.body.newPassword;
  }

  await user.save();

  // Log action
  actionLogger.info({
    user: user._id,
    action: "update_profile",
    impact: `User '${user.username}' updated profile${
      req.file ? " and avatar" : ""
    }${req.body.newPassword ? " and password" : ""}`,
    details: {
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/User
export const getAllUsers = asyncHandler(async (req, res) => {
  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filtering (by username, email, role)
  const filter = {};
  if (req.query.username) {
    filter.username = { $regex: req.query.username, $options: "i" };
  }
  if (req.query.email) {
    filter.email = { $regex: req.query.email, $options: "i" };
  }
  if (req.query.role) {
    filter.role = req.query.role;
  }
  if (req.query.isVerified) {
    filter.isVerified = req.query.isVerified === "true";
  }

  // Total count for pagination
  const total = await User.countDocuments(filter);

  // Fetch users
  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .select(
      "id username email avatar isVerified role createdAt updatedAt lastLogin"
    )
    .sort({ createdAt: -1 });

  // Logging
  actionLogger.info({
    user: req.user?._id || "anonymous",
    action: "get_all_users",
    impact: `Fetched ${users.length} users (page ${page}, limit ${limit})`,
    details: { filter, page, limit, total },
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: "Fetched all users",
    data: {
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      offset: skip,
      count: users.length,
    },
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/user
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
      data: null,
    });
  }

  // Find user and exclude sensitive fields
  const user = await User.findById(id).select(
    "id username email avatar isVerified role createdAt updatedAt lastLogin"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  }

  // Log action
  actionLogger.info({
    user: req.user?._id || "anonymous",
    action: "get_user_by_id",
    impact: `Fetched user with id ${id}`,
    details: { id },
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: `Fetched user with id ${id}`,
    data: user,
  });
});

// @desc    Update user by ID
// @route   PATCH /api/users/:id
// @access  Private/Admin + Moderator
export const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
      data: null,
    });
  }

  // Only verified admin/moderator can update
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Only verified admin or moderator can update users",
      data: null,
    });
  }

  // Find user to update
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  }

  // Update fields if provided
  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;
  if (req.body.role && ["admin", "moderator", "user"].includes(req.body.role)) {
    user.role = req.body.role;
  }
  if (typeof req.body.isVerified === "boolean") {
    user.isVerified = req.body.isVerified;
  }

  // Handle avatar upload
  if (req.file) {
    user.avatar = `/api/uploads/avatars/${req.file.filename}`;
  }

  await user.save();

  // Log action
  actionLogger.info({
    user: req.user._id,
    action: "update_user_by_id",
    impact: `User '${req.user.username}' updated user '${user.username}' (${id})`,
    details: {
      updatedFields: req.body,
      avatar: user.avatar,
    },
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: `User with id ${id} updated successfully`,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
      data: null,
    });
  }

  // Only verified admin can delete users
  if (req.user.role !== "admin" || !req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Only verified admins can delete users",
      data: null,
    });
  }

  // Find user to delete
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  }

  // Prevent deleting other admins unless verified
  if (user.role === "admin" && !req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Only verified admins can delete other admins",
      data: null,
    });
  }

  await user.deleteOne();

  // Log action
  actionLogger.info({
    user: req.user._id,
    action: "delete_user",
    impact: `User '${req.user.username}' deleted user '${user.username}' (${id})`,
    details: { deletedUserId: id, deletedUserRole: user.role },
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: `User with id ${id} deleted successfully`,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});
