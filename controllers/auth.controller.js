const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");
const moment = require('moment');
const otpGenerator = require('otp-generator');
const sendPasswordResetEmail = require('../config/mail.sender');

const getLogin = (req, res) => {
  res.render("login.ejs");
};

const postLogin = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true,
});

const getRegister = (req, res) => {
  res.render("register.ejs");
};

const postRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash("error", "User with this email already exists");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage: req.file ? req.file.filename : null,
    });

    await newUser.save();

    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/login");
  } catch (error) {
    console.error("Error in registration:", error);
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/register");
  }
};

const getDashboard = (req, res) => {
  res.render("dashboard.ejs", { user: req.user });
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    req.flash("success", "You have been successfully logged out!");
    res.redirect('/login');
  });
};

const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = passport.authenticate('google', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
});

const getForgetPassword = (req, res) => {
  res.render('forgetPassword.ejs');
};

const getResetPassword = (req, res) => {
  const { email } = req.params;
  res.render('resetPassword.ejs', { email });
};

const sendOtpByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/forget-password');
    }

    const name = user.name;
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    await sendPasswordResetEmail(name, email, otp);

    const timestamp = Date.now();
    await User.updateOne({ email }, { $set: { OTP: { code: otp, timestamp } } });

    console.log('OTP sent successfully');

    req.flash('success', 'OTP sent successfully. Please check your email.');
    res.redirect(`/reset-password/${email}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
    req.flash('error', 'Error sending OTP. Please try again.');
    res.redirect('/forget-password');
  }
};

const updatePasswordWithOtp = async (req, res) => {
  const { email } = req.params;
  const { otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, 'OTP.code': otp });

    if (!user) {
      req.flash('error', 'Invalid OTP');
      return res.redirect(`/reset-password/${email}`);
    }

    const otpTimestamp = moment(user.OTP.timestamp);
    const currentTimestamp = moment();
    const otpValidityDuration = moment.duration(currentTimestamp.diff(otpTimestamp)).asMinutes();

    if (otpValidityDuration > 15) {
      req.flash('error', 'OTP has expired');
      return res.redirect(`/reset-password/${email}`);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ email }, {
      $set: {
        password: hashedPassword,
        OTP: null
      }
    });

    req.flash('success', 'Password updated successfully. Please log in with your new password.');
    res.redirect('/login');
  } catch (error) {
    console.error('Error updating password with OTP:', error);
    req.flash('error', 'Error updating password. Please try again.');
    res.redirect(`/reset-password?email=${email}`);
  }
};

const getLandingPage = (req, res) => {
  res.render('landingPage.ejs'); 
};


module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getDashboard,
  logout,
  googleLogin,
  googleCallback,
  getForgetPassword,
  getResetPassword,
  sendOtpByEmail,
  updatePasswordWithOtp,
  getLandingPage,
};
