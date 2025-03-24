const roleCheck = (roles) => {
    return (req, res, next) => {
        const userRole = req.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied",
                success: false,
            });
        }

        next();
    };
};

export default roleCheck;
