const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkNotAuthenticated} = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/image.middleware')
const {
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
  getLandingPage
} = require('../controllers/auth.controller');

router.get('/', checkNotAuthenticated, getLandingPage)

router.get("/login", checkNotAuthenticated, getLogin);
router.get("/register", checkNotAuthenticated, getRegister);

router.post("/login", postLogin);
router.post("/register", ensureAuthenticated, uploadImage.single("profileImage"), postRegister);

router.post("/logout", logout);

router.get("/dashboard", ensureAuthenticated, getDashboard);

router.get('/auth/google', googleLogin);
router.get('/google-auth', googleCallback);

router.get('/forget-password', getForgetPassword);
router.get('/reset-password/:email', getResetPassword);

router.post('/forget-password', sendOtpByEmail);
router.post('/reset-password/:email', updatePasswordWithOtp);

module.exports = router;
