export const OTPMessage = (otp) => {
    const message =
        `
    <p>Your OTP code is: <strong>${otp}</strong></p>
    
    <p> This code will expire in 5 minutes.</p>
    
    <p>If you didn't request this, please ignore the email.</p>

    `;
    return message;
};