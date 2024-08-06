const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/videoController');
const { getClassesHandler } = require('../controllers/classController');

router.get('/', authenticateToken, getClassesHandler);

module.exports = router;
