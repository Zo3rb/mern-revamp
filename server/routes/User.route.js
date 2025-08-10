import express from "express";

import { authLimiter } from "../middleware/rateLimiter.js";
import {
  registerUser,
  loginUser,
  verifyUserOtp,
  resendVerificationOtp,
  forgotPassword,
  resetPassword,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
} from "../controllers/User.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { avatarUpload } from "../utils/multer.js";
import {
  registerValidator,
  loginValidator,
  verifyOtpValidator,
  resendOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/User.validator.js";

const router = express.Router();

// Public routes
router.post("/", authLimiter, registerValidator, registerUser);
router.post("/login", authLimiter, loginValidator, loginUser);
router.post("/verify-otp", authLimiter, verifyOtpValidator, verifyUserOtp);
router.post(
  "/resend-otp",
  authLimiter,
  resendOtpValidator,
  resendVerificationOtp
);
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidator,
  forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  resetPasswordValidator,
  resetPassword
);

// Authenticated user routes
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getUserProfile);
router.patch("/me", protect, avatarUpload.single("avatar"), updateUserProfile);

// Admin or extended routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUserById);
router.delete("/:id", deleteUser);

export default router;
