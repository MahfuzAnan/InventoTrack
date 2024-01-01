const express = require("express");
const router = express.Router();
const { uploadImage } = require("../middlewares/image.middleware");
const { ensureAuthenticated } = require('../middlewares/auth.middleware');
const { 
    getUserProfile,
    getEditProfile,
    postEditProfile,
    getUpdatePassword,
    postUpdatePassword,
    deleteAccount
    } = require('../controllers/user.controller');


router.get('/profile', ensureAuthenticated, getUserProfile);
router.get("/edit-profile", ensureAuthenticated, getEditProfile);
router.patch("/edit-profile", ensureAuthenticated, uploadImage.single("profileImage"), postEditProfile);

router.get("/update-password", ensureAuthenticated, getUpdatePassword);
router.patch("/update-password", ensureAuthenticated, postUpdatePassword);

router.delete('/delete-account', ensureAuthenticated, deleteAccount);

module.exports = router;