const globalEvents = require('../../../events');
const logger = require('../../../utils/logger');
const {
  serverErrorResponse,
  successResponse,
} = require('../../../utils/response');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const inboundWebhook = async (req, res) => {
  const twiml = new VoiceResponse();

  twiml.say('Hello from your pals at Twilio! Have fun.');

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};

const eventsWebhook = async (req, res) => {
  try {
    const { To, From, CallSid, CallStatus } = req.body;

    // console.log(To, From, CallSid, CallStatus);

    globalEvents.emit(`status:${CallStatus}`, CallStatus);

    return successResponse(res, 'Event received');
  } catch (err) {
    logger.error(`Error in events webhhok ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};
const twilioController = {
  inboundWebhook,
  eventsWebhook,
};
module.exports = twilioController;
