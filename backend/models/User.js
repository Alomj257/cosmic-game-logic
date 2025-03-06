const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: Number, required: true },
        userType: { 
            type: String, 
            required: true, 
            enum: ["BOOK_READER", "ADMIN", "SILVER", "GOLD", "BASIC"] 
        },
        resetOtp: { type: String },
        otpExpiry: { type: Date },
    },
    { timestamps: true }
);

// Hash password before saving user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("User", userSchema);
