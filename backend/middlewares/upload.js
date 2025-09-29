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
        cb(null, uploadDir); // ✅ Save files in 'backend/uploads'
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + file.originalname;
        cb(null, uniqueSuffix); // ✅ Avoid file name conflicts
    },
});

export const upload = multer({ storage });
