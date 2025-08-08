import appConfig from "./config/index.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Locals
import routeLoggingMiddleware from "./middleware/routeLogger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/api.js";

const app = express();

// Middleware
app.use(cors({ origin: appConfig.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Local Middleware
app.use(routeLoggingMiddleware);

// Basic route for development
app.get("/api/ping", (req, res) => {
  res.status(200).json({
    success: "true",
    message: "API IS RUNNING ... PONG!",
    data: "null",
  });
});

// API Centeral Router
app.use("/api", apiRoutes);

// Serve React static build in production
if (appConfig.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Use app.use as the catch-all for unmatched GET requests
  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      !req.originalUrl.startsWith("/api") &&
      !req.originalUrl.includes(".")
    ) {
      res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
    } else {
      next();
    }
  });
} else {
  // Basic route for development
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "API IS RUNNING ...",
      data: null,
    });
  });
}

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Initiate the Server
connectDB().then(() => {
  app.listen(appConfig.PORT, () => {
    console.log(`[SERVER]: Application is running on PORT: ${appConfig.PORT}`);
  });
});
