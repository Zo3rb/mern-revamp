import dotenv from "dotenv";
dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/mern-revamp",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
};
