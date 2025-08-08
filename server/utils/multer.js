import fs from "fs";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Allowed file types for different scenarios
const fileTypes = {
  avatar: /jpeg|jpg|png|gif/,
  image: /jpeg|jpg|png|gif/,
  document: /pdf|doc|docx/,
  // Add more as needed
};

// File filter for security
const fileFilter = (allowedTypes) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Storage configuration with auto directory creation
const storage = (folder = "uploads") =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(process.cwd(), folder);
      // Auto-create directory if it doesn't exist
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, uuidv4() + ext);
    },
  });

// Multer uploaders for different scenarios
export const avatarUpload = multer({
  storage: storage("uploads/avatars"),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter(fileTypes.avatar),
});

export const imageUpload = multer({
  storage: storage("uploads/images"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter(fileTypes.image),
});

export const documentUpload = multer({
  storage: storage("uploads/documents"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter(fileTypes.document),
});
