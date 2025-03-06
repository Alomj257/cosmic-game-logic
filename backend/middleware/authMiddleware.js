const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied, Token Not Provided" });
    }

    try {
        // Check for "Bearer " prefix
        const tokenParts = token.split(" ");
        if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
            return res.status(400).json({ message: "Invalid Token Format" });
        }

        const verified = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(400).json({ message: "Invalid Token" });
    }
};
