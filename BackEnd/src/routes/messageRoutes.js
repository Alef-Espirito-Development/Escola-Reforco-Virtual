const express = require('express');
const router = express.Router();
const { getMessagesHandler, sendMessageHandler } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/chats/:chatId/messages', authMiddleware, getMessagesHandler);
router.post('/chats/:chatId/messages', authMiddleware, sendMessageHandler);

module.exports = router;
