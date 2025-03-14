import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        userType: {
            type: String,
            required: true,
            enum: [
                "BOOK_READER",
                "ADMIN",
                "SILVER",
                "GOLD",
                "BASIC",
            ],
        },
        forget: {
            otp: String,
            otpExpiration: Date,
            otpVerify: Boolean,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        }
    }
);

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password") || user.isNew) {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;


