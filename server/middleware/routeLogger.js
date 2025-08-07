import { routeLogger } from "../utils/logger.js";

const routeLoggingMiddleware = (req, res, next) => {
  routeLogger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    timestamp: new Date().toISOString(),
  });
  next();
};

export default routeLoggingMiddleware;
