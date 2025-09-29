import multer from "multer";
import fs from "fs";
import path from "path";

// ✅ Ensure the 'uploads' directory exists
const uploadDir = path.join("backend", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 'uploads/' directory created successfully.");
}

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in 'backend/uploads'
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // preserve extension
    cb(null, "certificate-" + uniqueSuffix + ext);
  },
});

// ✅ Accept any file type
export const singleUpload = multer({ storage }).single("certificate");
