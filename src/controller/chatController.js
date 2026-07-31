const { askQuestion } = require('../services/chatService');
const chatModel = require('../models/chat.model');
const { chatSchema } = require('../validations/chatValidation');
const logger = require('../config/logger');

const chat = async (req, res) => {
    try {
        const validation = chatSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "validation failed",
                errors: validation.error.issues.map(e => e.message)
            });
        }

        const { question } = validation.data;
        const userDepartment = req.user.department;
        const userRole = req.user.role;

        const result = await askQuestion(question, userDepartment, userRole);

        await chatModel.create({
            user: req.user.id,
            question,
            answer: result.answer,
            sources: result.sources,
        });

        return res.status(200).json({
            message: "answer generated successfully",
            answer: result.answer,
            sources: result.sources,
        });
    } catch (error) {
        logger.error(`Error in chat controller: ${error.message}`);
        return res.status(500).json({ message: "internal server error", error: error.message });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const history = await chatModel.find({ user: req.user.id }).sort({ createdAt: -1 });

        return res.status(200).json({ message: "chat history fetched successfully", history });
    } catch (error) {
        logger.error(`Error fetching chat history: ${error.message}`);
        return res.status(500).json({ message: "internal server error", error: error.message });
    }
};

module.exports = { chat, getChatHistory };