// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { getUserChatsHandler, createChatHandler, getAllUsersHandler, getChatParticipantsHandler } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/users/:id/chats', authMiddleware, getUserChatsHandler);
router.post('/chats', authMiddleware, createChatHandler);
router.get('/users', authMiddleware, getAllUsersHandler);
router.get('/chats/:chatId/participants', authMiddleware, getChatParticipantsHandler);

module.exports = router;
