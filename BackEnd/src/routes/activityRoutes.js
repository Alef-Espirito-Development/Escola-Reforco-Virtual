// routes/activityRoutes.js
const express = require('express');
const { addActivity, getActivities, getActivityById, editActivity, removeActivity } = require('../controllers/activityController');
const router = express.Router();

router.post('/', addActivity);
router.get('/', getActivities);
router.get('/:id', getActivityById);
router.put('/:id', editActivity);
router.delete('/:id', removeActivity);

module.exports = router;
