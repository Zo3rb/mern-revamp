import express from "express";
import userRoutes from "./User.route.js";

const router = express.Router();

router.use("/users", userRoutes);

export default router;
