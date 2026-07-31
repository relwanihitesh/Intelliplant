const userModel = require('../models/user.model');
const bcrypt = require("bcryptjs");
const { updateProfileSchema, changePasswordSchema } = require('../validations/userValidation');
const logger = require('../config/logger');

const updateProfile = async (req, res) => {
    const userId = req.user.id;

    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "validation failed",
            errors: validation.error.issues.map(e => e.message)
        });
    }

    try {
        const { username, department, profilePicture } = validation.data;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { username, department, profilePicture },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "user not found" });
        }

        return res.status(200).json({ message: "user profile updated successfully", updatedUser });
    } catch (err) {
        logger.error(`Error updating user profile: ${err.message}`);
        return res.status(500).json({ message: "internal server error", error: err.message });
    }
};

const changePassword = async (req, res) => {
    const userId = req.user.id;

    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "validation failed",
            errors: validation.error.issues.map(e => e.message)
        });
    }

    const { oldPassword, newPassword } = validation.data;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "old password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        return res.status(200).json({ message: "password changed successfully" });
    } catch (err) {
        logger.error(`Error changing password: ${err.message}`);
        return res.status(500).json({ message: "internal server error", error: err.message });
    }
};

const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message: "user not found"});
        }
       return res.status(200).json({message: "user profile fetched successfully", user});

    }catch(err){
        logger.error(`Error fetching user profile: ${err.message}`);
        return res.status(500).json({message: "internal server error", error: err.message});
    }
}

const deleteProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const deleteUser = await userModel.findByIdAndDelete(userId);
        if (!deleteUser) {
            return res.status(404).json({ message: "user not found" });
        }

        res.clearCookie("token");
        return res.status(200).json({ message: "user profile deleted successfully" });

    }catch (err) {
        logger.error(`Error deleting user profile: ${err.message}`);
        return res.status(500).json({ message: "internal server error", error: err.message });
    }
};

module.exports = { getProfile, updateProfile, deleteProfile, changePassword };
