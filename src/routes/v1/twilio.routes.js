const twilioController = require('../../controllers/v1/twilio');
const express = require('express');

const router = express.Router();

router.post('/voice', twilioController.inboundWebhook);
router.post('/events', twilioController.eventsWebhook);

module.exports = router;
