let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

function hasEmailEnv() {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.FEEDBACK_TO_EMAIL
  );
}

let transporter = null;
if (nodemailer && hasEmailEnv()) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendFeedbackMail({ category, subject, message, email, user }) {
  if (!transporter) {
    console.log('[mailer] Email disabled (missing nodemailer or SMTP env). Feedback will not be emailed.');
    return { sent: false };
  }
  const lines = [
    `Category: ${category}`,
    `Subject: ${subject}`,
    `From Email: ${email || 'N/A'}`,
    `User ID: ${user?._id || user || 'N/A'}`,
    '',
    message,
  ].join('\n');

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    to: process.env.FEEDBACK_TO_EMAIL || 'shriyapachunuri1105@gmail.com',
    subject: `[CampusConnect Feedback] ${subject}`,
    text: lines,
  });
  return { sent: true, messageId: info.messageId };
}

module.exports = { sendFeedbackMail, hasEmailEnv };
