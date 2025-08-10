import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be at most 30 characters"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: Date,
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook", "x", "instagram", "youtube"],
      default: "local",
    },
    providerId: String,
    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    sessions: [
      {
        loginAt: { type: Date, default: Date.now },
        ip: String,
        userAgent: String,
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to hash password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
