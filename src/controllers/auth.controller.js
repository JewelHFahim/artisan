const {
  RESET_TOKEN_EXPIRY,
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_USER,
  MAILTRAP_PASS,
  SECRET,
} = require("../config/env");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Sent reset token
async function handleResetPassword(req, res) {
  const { email } = req.body;

  console.log(email)

  const user = await User.findOne({email});

  if (!user)
    return res.status(404).json({ status: false, message: "User not found" });

  // Generate a reset token
  const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: RESET_TOKEN_EXPIRY });

  // Send email with reset link
  const resetLink = `http://localhost:3000/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Fire Cutter" <jewelhfahim@gmail.com>',
      to: email,
      subject: "Password Reset Request",
      text: `Reset your password using the following link: ${resetLink}`,
      html: `<p>Reset your password using the link: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    console.log(`Message sent: ${info.messageId}`);

    return res.status(201).json({status: true, message: "Reset email sent in your mail"})
  } catch (err) {
    console.error(`Error sending email: ${err.message}`);
    return res.status(500).json({status: false, message: "Reset email sent failed"})
  }
}


// Submit new password
async function handleSubmitNewPass(req, res){
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      // Verify token
      const decoded = jwt.verify(token, SECRET);
      const user = await User.findById(decoded._id);
  
      if (!user) return res.status(404).json({status: false, message: 'Invalid token or user not found' });
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findByIdAndUpdate(user._id, {password: hashedPassword})
      
      return res.status(201).json({status: true, message: 'Password reset successful' });
    } catch (err) {
      return res.status(400).json({status: false, message: 'Invalid or expired token' });
    }
}



module.exports = {
  handleResetPassword,
  handleSubmitNewPass
};
