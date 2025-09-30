import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to: string, subject: string, html: string) => {
  try {
    console.log("📧 [sendMail] Starting email send process...");
    console.log("📧 [sendMail] To:", to);
    console.log("📧 [sendMail] Subject:", subject);
    console.log("📧 [sendMail] From:", process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com");
    console.log("📧 [sendMail] API Key present:", !!process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("❌ [sendMail] Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("✅ [sendMail] Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ [sendMail] Email sending failed:", error);
    throw error;
  }
};

export default sendMail;
