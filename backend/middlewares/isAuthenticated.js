import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing! Check your .env file.");
    process.exit(1);
}

const isAuthenticated = (req, res, next) => {
    try {
        let token = req.cookies?.token; // ✅ First check for token in cookies
        console.log("📌 Token from cookies:", token);

        // 🔹 If token is not found in cookies, check Authorization header
        if (!token && req.headers.authorization) {
            const [scheme, credentials] = req.headers.authorization.split(" ");
            if (scheme === "Bearer") {
                token = credentials;
                console.log("📌 Token from Authorization header:", token);
            }
        }

        // 🔹 Reject request if token is still missing
        if (!token) {
            console.warn("❌ No token provided, authentication failed.");
            return res.status(401).json({
                message: "User not authenticated. Please log in.",
                success: false,
            });
        }

        // 🔹 Verify token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("❌ Authentication Error:", err.message);
                
                // Handle expired token separately
                const errorMessage =
                    err.name === "TokenExpiredError"
                        ? "Session expired. Please log in again."
                        : "Invalid token. Authentication failed.";

                return res.status(401).json({ message: errorMessage, success: false });
            }

            // 🔹 Attach user details to request object
            req.user = { id: decoded.userId, role: decoded.role }; // Change here
            console.log("✅ Authenticated User ID:", req.user.id, "| Role:", req.user.role);

            next(); // Proceed to the next middleware or controller
        });

    } catch (error) {
        console.error("❌ Unexpected Error in Authentication Middleware:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export default isAuthenticated;
