const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const subTaskRoutes = require('./sub_task.routes');
const twilioRoutes = require('./twilio.routes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/task', taskRoutes);
router.use('/sub_task', subTaskRoutes);
router.use('/twilio', twilioRoutes);

module.exports = router;
