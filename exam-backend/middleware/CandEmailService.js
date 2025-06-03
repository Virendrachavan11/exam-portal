import { sendMail } from "./emailService.js";

export const CandAccountCreationMail = async (EmailId, nameofCand, Password) => {
    const subject = "Your Phoenix Exam Portal Account Details";
    const text = "Your candidate account has been created. Please see below for login credentials.";

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4A90E2;">Phoenix Exam Portal</h2>
            <p>Hi <strong>${nameofCand}</strong>,</p>
            <p>Your candidate account has been successfully created by your institution.</p>

            <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0;"><strong>Email:</strong> ${EmailId}</p>
                <p style="margin: 0;"><strong>Temporary Password:</strong> ${Password}</p>
            </div>

            <p>👉 Please log in and <strong>change your password immediately</strong> to ensure your account remains secure.</p>

            <p style="margin-top: 30px;">Best regards,<br/>Phoenix Exam Portal Team</p>
        </div>
    `;

    try {
        const result = await sendMail(EmailId, subject, text, html);
        console.log(`Email sent to ${EmailId}:`, result.response);
        return { success: true, message: "Email sent successfully", result };
    } catch (error) {
        console.error(`Failed to send email to ${EmailId}:`, error.message);
        return { success: false, message: "Email sending failed", error: error.message };
    }
};
