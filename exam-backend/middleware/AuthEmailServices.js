import { sendMail } from "./emailService.js";

export const ResetPasswordMail = async (emailId, nameofuser, otp) => {
    const subject = "OTP for Password Reset - Phoenix Exam Portal";
    const text = `Hi ${nameofuser}, your OTP for resetting your password is: ${otp}. This OTP is valid for 10 minutes.`;

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4A90E2;">Phoenix Exam Portal</h2>
            <p>Hi <strong>${nameofuser}</strong>,</p>
            <p>We received a request to reset your password. Use the OTP below to complete the process:</p>

            <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
                <p style="font-size: 16px; margin: 0;"><strong>Email:</strong> ${emailId}</p>
                <p style="font-size: 22px; font-weight: bold; margin: 10px 0;">${otp}</p>
                <p style="margin: 0; color: #555;">This OTP is valid for the next <strong>10 minutes</strong>.</p>
            </div>

            <p>If you didn’t initiate this request, you can safely ignore this email.</p>

            <p style="margin-top: 30px;">Best regards,<br/>Phoenix Exam Portal Team</p>
        </div>
    `;

    try {
        const result = await sendMail(emailId, subject, text, html);
        console.log(`Email sent to ${emailId}:`, result.response);
        return { success: true, message: "OTP email sent successfully", result };
    } catch (error) {
        console.error(`Failed to send email to ${emailId}:`, error.message);
        return { success: false, message: "OTP email sending failed", error: error.message };
    }
};
