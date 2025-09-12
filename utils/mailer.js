// backend/utils/mailer.js
import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_EMAIL_PASS =
  process.env.ADMIN_EMAIL_PASS || process.env.ADMIN_EMAIL_PASSWORD; // fallback
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "Ecopuls Feedback Bot";

if (!ADMIN_EMAIL || !ADMIN_EMAIL_PASS) {
  console.warn(
    "⚠️ Mailer not configured: set ADMIN_EMAIL and ADMIN_EMAIL_PASS in your environment."
  );
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ADMIN_EMAIL,
    pass: ADMIN_EMAIL_PASS
  }
});

// Optional: verify SMTP connection
export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("✅ Mailer: SMTP connection verified.");
  } catch (err) {
    console.error("❌ Mailer verify failed:", err);
  }
};

// Send notification email to admin when new feedback arrives
export const sendFeedbackNotification = async (feedback) => {
  if (!ADMIN_EMAIL || !ADMIN_EMAIL_PASS) {
    throw new Error("ADMIN_EMAIL or ADMIN_EMAIL_PASS not configured");
  }

  const createdAt = feedback.createdAt || new Date();
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.4">
      <h2>🌿 New Feedback Received</h2>
      <p><strong>Name:</strong> ${feedback.name || "—"}</p>
      <p><strong>Contact:</strong> ${feedback.email || "—"}</p>
      <p><strong>Product:</strong> ${feedback.product || "—"}</p>
      <p><strong>Rating:</strong> ${feedback.rating ?? "—"}</p>
      <p><strong>Experience:</strong> ${feedback.experience || "—"}</p>
      <p><strong>Support answered?:</strong> ${feedback.support || "—"}</p>
      <p><strong>Unresolved:</strong> ${feedback.unresolved || "—"}</p>
      <p><strong>Subscribed?:</strong> ${feedback.subscribe ? "Yes" : "No"}</p>
      <p><strong>Message:</strong><br/>${(feedback.message || "—")
        .replace(/\n/g, "<br/>")}</p>
      <hr />
      <p style="font-size:12px;color:#666">Feedback ID: ${
        feedback._id || "—"
      } • Received: ${new Date(createdAt).toLocaleString()}</p>
    </div>
  `;

  const mailOptions = {
    from: `${MAIL_FROM_NAME} <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `New Feedback • ${feedback.name || "Anonymous"} • ${
      feedback.product || "General"
    }`,
    text: `New feedback from ${feedback.name || "Anonymous"}\n\n${
      feedback.message || ""
    }`,
    html
  };

  return transporter.sendMail(mailOptions);
};
