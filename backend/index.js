import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./utils/db.js"; // MySQL database connection
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import companyRoutes from "./routes/company.route.js";
import applicationRoutes from "./routes/application.route.js";
import { singleUpload } from "./middlewares/multer.js";




// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cookieParser()); // Parse cookies
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Enable CORS

// Test MySQL connection
db.getConnection()
    .then(() => console.log("✅ MySQL Database connected successfully"))
    .catch((error) => console.error("❌ Database connection failed:", error));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Job Portal API");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

