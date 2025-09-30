const sendMail = async (to: string, subject: string, html: string) => {
  // Check if we're in a build environment or if API key is missing
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ [sendMail] RESEND_API_KEY not available, skipping email send");
    return { id: 'build-skip', to, subject };
  }

  try {
    // Lazy load Resend only when needed
    const { Resend } = await import("resend");
    
    console.log("📧 [sendMail] Starting email send process...");
    console.log("📧 [sendMail] To:", to);
    console.log("📧 [sendMail] Subject:", subject);
    console.log("📧 [sendMail] From:", process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com");
    console.log("📧 [sendMail] API Key present:", !!process.env.RESEND_API_KEY);
    
    const resend = new Resend(process.env.RESEND_API_KEY);
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
