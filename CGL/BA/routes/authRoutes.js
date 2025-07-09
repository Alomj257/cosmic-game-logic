const express = require("express");
const { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    deleteUser, 
    forgotPassword, 
    confirmOtp, 
    resetPassword 
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile/update", authMiddleware, updateProfile);
router.delete("/profile/delete", authMiddleware, deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/confirm-otp", confirmOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
