const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Environment variables for email
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail(email); // Implement this function based on your user model
  if (!user) {
    return res.status(404).json({ message: 'No user found with this email address.' });
  }

  // Generate a token or similar mechanism for resetting the password
  const resetToken = generateResetToken(); // Implement token generation and storage

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Please use the following link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`
  };

  mailTransport.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to send email.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Reset link sent to your email.' });
    }
  });
});

module.exports = router;
