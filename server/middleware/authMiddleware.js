import jwt from "jsonwebtoken";

import appConfig from "../config/index.js";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized, no token",
        data: null,
      });
  }

  try {
    const decoded = jwt.verify(token, appConfig.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized, user not found",
          data: null,
        });
    }
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized, token failed",
        data: null,
      });
  }
};
