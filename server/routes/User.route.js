import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
} from "../controllers/User.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/User.validator.js";

const router = express.Router();

// Public routes
router.post("/", registerValidator, registerUser); // POST /api/users      (register)
router.post("/login", loginValidator, loginUser); // POST /api/users/login
router.post("/logout", logoutUser); // POST /api/users/logout

// Authenticated user routes
router.get("/me", getUserProfile); // GET  /api/users/me   (current user)
router.patch("/me", updateUserProfile); // PATCH /api/users/me  (update current user)

// Admin or extended routes
router.get("/", getAllUsers); // GET  /api/users      (all users, admin)
router.get("/:id", getUserById); // GET  /api/users/:id  (single user by id)
router.patch("/:id", updateUserById); // PATCH /api/users/:id (update any user, admin)
router.delete("/:id", deleteUser); // DELETE /api/users/:id

export default router;
