import { actionLogger } from "../utils/logger.js";

// 404 Not Found Handler
export const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

// General Error Handler
export const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // MongoDB duplicate key error
  if (err.code && err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`;
  }

  // express-validator error
  if (Array.isArray(err.errors) && err.errors[0]?.msg) {
    statusCode = 400;
    message = err.errors.map((e) => e.msg).join(", ");
  }

  // Log the error
  actionLogger.error({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user?.id || "anonymous",
    timestamp: new Date().toISOString(),
  });

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
