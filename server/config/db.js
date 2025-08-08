import mongoose from "mongoose";
import appConfig from "./index.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(appConfig.MONGO_URI);
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
