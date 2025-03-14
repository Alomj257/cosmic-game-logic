import { Router } from "express";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyOtpSchema } from "../validationSchema/auth.js";
import { login, register, resetPassword, sendOtpToResetPassword, verifyOtp } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validation.js";
const router = Router();

router.route('/register').post(validate(registerSchema), register);

router.route('/login').post(validate(loginSchema), login);

router.route('/forgotpassword').post(validate(forgotPasswordSchema), sendOtpToResetPassword)

router.route('/verifyotp').post(validate(verifyOtpSchema), verifyOtp);

router.route('/resetpassword').post(validate(resetPasswordSchema), resetPassword);

export default router;