import jwt from "jsonwebtoken";
import appConfig from "../config/index.js";

// Generate JWT token with userId and optional payload
export const generateToken = (userId, extraPayload = {}) => {
  return jwt.sign({ id: userId, ...extraPayload }, appConfig.JWT_SECRET, {
    expiresIn: appConfig.JWT_EXPIRES_IN,
  });
};

// Helper to set JWT as HTTP-only cookie
export const setTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: appConfig.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
};

// Helper to clear JWT cookie (for logout)
export const clearTokenCookie = (res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: appConfig.NODE_ENV === "production",
    sameSite: "strict",
  });
};
