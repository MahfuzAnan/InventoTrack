const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendPasswordResetEmail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'mahfuzanan20@gmail.com',
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: 'mahfuzanan20@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Hi ${name}, Your OTP is ${otp}`,
    });

    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Email not sent!', error);
    throw error;
  }
};

module.exports = sendPasswordResetEmail;
