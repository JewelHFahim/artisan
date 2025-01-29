const nodemailer = require('nodemailer');
const { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS } = require('../config/env');

// Create a transporter using Mailtrap
const transporter = nodemailer.createTransport({
  host: MAILTRAP_HOST,
  port: MAILTRAP_PORT,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
});

// Function to send a test email
async function sendResetEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"Fire Cutter" <jewelhfahim@gmail.com>', // Sender address
      to: 'jewelvsbfahim@gmail.com',               // Test recipient
      subject: 'Password reset request',       // Subject line
      text: 'Reset your password using the following link: ${resetLink}',      // Plain text body
      html: `<p>Reset your password using the link: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    console.log(`Message sent: ${info.messageId}`);
  } catch (err) {
    console.error(`Error sending email: ${err.message}`);
  }
}

// Send the test email
sendTestEmail();
