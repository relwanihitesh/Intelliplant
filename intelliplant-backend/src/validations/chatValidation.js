const { z } = require('zod');

const chatSchema = z.object({
    question: z.string().min(3, "question must be at least 3 characters"),
});

module.exports = { chatSchema };