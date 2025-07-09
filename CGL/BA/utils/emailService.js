const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a reusable transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send Email Function
exports.sendEmail = async (to, subject, text, html) => {
    try {
        await transporter.sendMail({
            from: `"COSMIC GAME LOGIC" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
    } catch (error) {
        console.error(`❌ Email sending failed: ${error.message}`);
    }
};
