import appConfig from "./config/index.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Locals
import routeLoggingMiddleware from "./middleware/routeLogger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
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

// Basic route
app.get("/", (req, res) => {
  res.status(200).json({
    success: "true",
    message: "Application is Running Successfully",
    data: null,
  });
});

// API Centeral Router
app.use("/api", apiRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Initiate the Server
app.listen(appConfig.PORT, () => {
  console.log(`[SERVER]: Application is running on PORT: ${appConfig.PORT}`);
});
