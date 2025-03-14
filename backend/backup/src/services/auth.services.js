import createHttpError from "http-errors";
import User from "../models/User.js";
import { jwtServices } from "./jwt.services.js";
import { config } from "../config/envConfig.js";
import sendEmail from "../utils/sendEmail.js";
import { OTPMessage } from "../helpers/emailMessages.js";

const register = async (obj) => {
    const { firstName, lastName, email, password, country, phone, userType } = obj;

    //check if the email is already registered
    const user = await User.findOne({ email });
    if (user) {
        throw createHttpError(400, 'Email already registered');
    }

    const newUser = new User({ firstName, lastName, email, password, country, phone, userType });
    await newUser.save();
    return newUser;
};

const login = async (obj) => {
    const { email, password } = obj;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw createHttpError(401, 'Invalid credentials');
    }

    const payload = {
        userId: user._id,
        email: user.email,
        userType: user.userType,
    };

    const accessToken = jwtServices.generateToken(payload, config.JWT_SECRET, config.JWT_EXPIRATION_TIME);
    return { accessToken, user };
};

const sendOtpToResetPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.forget.otp = OTP;
    user.forget.otpExpiration = new Date(Date.now() + (5 * 60 * 1000)); // 5 minute
    user.forget.otpVerify = false;
    await user.save();

    const message = OTPMessage(OTP);

    // send OTP to user's email
    const isEmailSend = await sendEmail(message, email, 'OTP Code');
    if (!isEmailSend) {
        throw createHttpError(500, 'Failed to send OTP');
    }
    return true;
}

const verifyOtp = async (email, otp) => {
    const user = await User.findOne({ email });
    if (!user || user.forget.otp != otp || user.forget.otpVerify || user.forget.otpExpiration < new Date()) {
        throw createHttpError(401, 'Invalid OTP or expired');
    }

    user.forget.otpVerify = true;
    await user.save();
    return true;
}

const resetPassword = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !user.forget.otpVerify || !user.forget.otp) {
        throw createHttpError(401, 'Invalid request');
    }

    user.password = password;
    user.forget = {
        otp: "",
        otpExpiration: new Date(),
        otpVerify: false
    };
    await user.save();
    return true;
};

export const authServices = {
    register,
    login,
    sendOtpToResetPassword,
    verifyOtp,
    resetPassword
};