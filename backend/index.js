import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./utils/db.js"; // MySQL database connection

// Import Routes
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import companyRoutes from "./routes/company.route.js";
import educationRoutes from "./routes/education.route.js";
import profileRoutes from "./routes/profile.route.js"; 
import applicationRoutes from "./routes/application.route.js";  // ✅ Import Application Routes

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle CORS Preflight Requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

// ✅ Debugging Middleware
app.use((req, res, next) => {
  console.log("📩 Received Request:", req.method, req.path);
  console.log("🔍 Headers:", req.headers);
  next();
});

// ✅ Test MySQL Connection
db.getConnection()
  .then(() => console.log("✅ MySQL Database connected successfully"))
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1); 
  });

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);  // ✅ Standardized company route
app.use("/api/education", educationRoutes);  // ✅ Updated education route
app.use("/api/profile", profileRoutes);  // ✅ Updated profile route
app.use("/api/applications", applicationRoutes);  // ✅ Standardized application route

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Job Portal API 🚀");
});

// ✅ 404 Middleware (Handles undefined routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", success: false });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", success: false });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
