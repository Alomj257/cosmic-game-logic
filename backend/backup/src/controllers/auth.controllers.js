import { authServices } from "../services/auth.services.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const register = asyncHandler(async (req, res, next) => {
    const registeredUser = await authServices.register(req.body);
    res.status(201).json(registeredUser);
});

export const login = asyncHandler(async (req, res, next) => {
    const { accessToken, user } = await authServices.login(req.body);
    res.status(200).json({ accessToken, user });
});

export const sendOtpToResetPassword = asyncHandler(async (req, res, next) => {
    await authServices.sendOtpToResetPassword(req.body.email);
    res.status(200).json({
        email: req.body.email,
        message: 'OTP sent to your email'
    });
});

export const verifyOtp = asyncHandler(async (req, res, next) => {
    await authServices.verifyOtp(req.body.email, req.body.otp);
    res.status(200).json({ message: 'OTP verified successfully' });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    await authServices.resetPassword(req.body.email, req.body.password);
    res.status(200).json({ message: 'Password reset successfully' });
});