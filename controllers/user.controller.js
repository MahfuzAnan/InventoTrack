const User = require("../models/User.model");
const bcrypt = require('bcryptjs');

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        console.log("User data:", user);

        if (!user) {
            console.log("User not found");
            req.flash("error", "User not found");
            return res.redirect("/dashboard");
        }

        res.render("profile.ejs", { user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        req.flash("error", "Error fetching user profile");
        res.redirect("/dashboard");
    }
};

const getEditProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        console.log("User data:", user);

        if (!user) {
            console.log("User not found");
            req.flash("error", "User not found");
            return res.redirect("/dashboard");
        }

        res.render("editProfile.ejs", { user });
    } catch (error) {
        console.error("Error fetching user profile for edit:", error);
        req.flash("error", "Error fetching user profile for edit");
        res.redirect("/dashboard");
    }
};

const postEditProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email } = req.body;

        let profileImage;

        if (req.file) {
            profileImage = req.file.filename;
        }

        console.log("Updating user profile:", userId);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, profileImage },
            { new: true }
        );

        console.log("Updated user data:", updatedUser);

        req.flash("success", "Profile updated successfully");
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error updating user profile:", error);
        req.flash("error", "Error updating user profile");
        res.redirect("/dashboard");
    }
};

const getUpdatePassword = async (req, res) => {
    res.render("updatePassword.ejs");
};

const postUpdatePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(userId);

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordMatch) {
            req.flash('error', 'Current password is incorrect');
            return res.redirect('/update-password');
        }

        if (newPassword !== confirmPassword) {
            req.flash('error', 'New password and confirm password do not match');
            return res.redirect('/update-password');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        req.flash('success', 'Password updated successfully');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error updating password:', error);
        req.flash('error', 'Error updating password. Please try again.');
        res.redirect('/update-password');
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);

        res.redirect('/login');
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getUserProfile,
    getEditProfile,
    postEditProfile,
    getUpdatePassword,
    postUpdatePassword,
    deleteAccount
};
