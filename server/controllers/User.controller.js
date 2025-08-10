import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";

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

  // Sedning welcome mail
  await sendMail({
    to: user.email,
    subject: "Welcome to MERN Revamp!",
    template: "welcome",
    context: { username: user.username },
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
  const user = await User.findById(req.user._id);

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
    user.avatar = `/uploads/avatars/${req.file.filename}`;
  }

  await user.save();

  // Log action
  actionLogger.info({
    user: user._id,
    action: "update_profile",
    impact: `User '${user.username}' updated profile${
      req.file ? " and avatar" : ""
    }`,
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
    },
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users logic here
  res.status(200).json({
    success: "true",
    message: "Fetched all users",
    data: "null",
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  // Get user by ID logic here
  res.status(200).json({
    success: "true",
    message: `Fetched user with id ${req.params.id}`,
    data: "null",
  });
});

// @desc    Update user by ID
// @route   PATCH /api/users/:id
// @access  Private/Admin
export const updateUserById = asyncHandler(async (req, res) => {
  // Update user by ID logic here
  res.status(200).json({
    success: "true",
    message: `Updated user with id ${req.params.id}`,
    data: "null",
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  // Delete user logic here
  res.status(200).json({
    success: "true",
    message: `Deleted user with id ${req.params.id}`,
    data: "null",
  });
});
