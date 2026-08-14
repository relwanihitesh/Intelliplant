const { z } = require('zod');

const updateProfileSchema = z.object({
    username: z.string().min(3, "username must be at least 3 characters").optional(),
    department: z.string().optional(),
    profilePicture: z.string().optional(),
});

const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "old password is required"),
    newPassword: z.string().min(6, "new password must be at least 6 characters"),
});

module.exports = { updateProfileSchema, changePasswordSchema };