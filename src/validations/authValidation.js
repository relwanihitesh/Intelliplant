const { z } = require('zod');

const registerSchema = z.object({
    username: z.string().min(3, "username must be at least 3 characters"),
    email: z.string().email("invalid email format"),
    password: z.string().min(6, "password must be at least 6 characters"),
    department: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email("invalid email format").optional(),
    username: z.string().optional(),
    password: z.string().min(1, "password is required"),
});

module.exports = { registerSchema, loginSchema };