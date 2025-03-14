import Joi from "joi";

export const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            "string.min": "Password must be at least 8 characters long",
            "any.required": "Password is required"
        }),
    country: Joi.string().required(),
    phone: Joi.string().required(),
    userType: Joi.string().required().valid("BOOK_READER", "ADMIN", "SILVER", "GOLD", "BASIC"),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
});


export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            "string.min": "Password must be at least 8 characters long",
            "any.required": "Password is required"
        }),
});