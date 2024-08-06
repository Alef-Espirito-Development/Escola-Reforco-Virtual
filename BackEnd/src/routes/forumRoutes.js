// routes/forumRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/videoController');
const {
  createTopicHandler,
  getTopicsHandler,
  getTopicHandler,
  createDiscussionHandler,
  likeDiscussionHandler,
  getMostLikedCommentsHandler,
} = require('../controllers/forumController');
const { getClassesHandler } = require('../controllers/classController');

const authorizeTeacher = (req, res, next) => {
  if (req.user.tipo !== 'Professor') {
    return res.status(403).send('Acesso negado');
  }
  next();
};

console.log('Definindo rotas do fórum...');

router.post('/topics', authenticateToken, authorizeTeacher, createTopicHandler);
router.get('/topics', authenticateToken, getTopicsHandler);
router.get('/topics/:id', authenticateToken, getTopicHandler);
router.post('/topics/:id/discussions', authenticateToken, createDiscussionHandler);
router.post('/discussions/:id/like', authenticateToken, likeDiscussionHandler);
router.get('/classes', authenticateToken, getClassesHandler);
router.get('/comments/most-liked', authenticateToken, getMostLikedCommentsHandler);

module.exports = router;
