const roleCheck = (allowedRoles = [] ) => {
    return (req, res, next) => {
     if (!req.user) return res.status(401).json({message: "Not authenticated", success: false });
       

     const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied",
                success: false,
            });
        }

        next();
    };
};

export default roleCheck;
