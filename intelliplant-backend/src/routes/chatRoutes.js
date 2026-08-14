const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/auth.middleware');
const { chat, getChatHistory } = require('../controller/chatController');

router.post('/ask', authUser, chat);
router.get('/history', authUser, getChatHistory);

module.exports = router;