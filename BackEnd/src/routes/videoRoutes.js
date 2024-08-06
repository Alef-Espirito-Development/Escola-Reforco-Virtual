const express = require('express');
const router = express.Router();
const { createVideoHandler, getAllVideosHandler, updateVideoHandler, deleteVideoHandler, likeVideoHandler } = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, uploadMiddleware.single('videoFile'), createVideoHandler);
router.get('/', authMiddleware, getAllVideosHandler);
router.put('/:videoId', authMiddleware, uploadMiddleware.single('videoFile'), updateVideoHandler);
router.delete('/:videoId', authMiddleware, deleteVideoHandler);
router.post('/:videoId/like', authMiddleware, likeVideoHandler);

module.exports = router;
