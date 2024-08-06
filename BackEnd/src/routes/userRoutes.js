const express = require('express');
const router = express.Router();
const { createUserHandler, getAllUsersHandler, getUserByIdHandler } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', createUserHandler);
router.get('/', getAllUsersHandler);
router.get('/:id', authMiddleware, getUserByIdHandler);

module.exports = router;
