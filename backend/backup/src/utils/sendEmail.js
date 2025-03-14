
import nodemailer from 'nodemailer';
import { config } from '../config/envConfig.js';

const sendEmail = (message, email, subject) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587 || 465,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.SENDER_EMAIL,
                pass: config.SENDER_EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: config.SENDER_EMAIL,
            to: email,
            subject: subject,
            text: "details",
            html: `${message}
          `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log("Successfully sent");
                resolve(true);
            }
        });
    });
};

export default sendEmail;
