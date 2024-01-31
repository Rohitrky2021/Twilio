const {
  TWILIO_PHONE_NUMBER,
  DEPLOYED_BACKEND_HOST,
} = require('../../../utils/config');
const logger = require('../../../utils/logger');
const twilioClient = require('../client');

const createCall = async ({ to }) => {
  try {
    const call = await twilioClient.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: to,
      from: TWILIO_PHONE_NUMBER,
      statusCallback: `${DEPLOYED_BACKEND_HOST}/v1/twilio/events`,
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });
    return [call, null];
  } catch (err) {
    logger.error(`Error while creating call ${err.message}`);
    return [null, err.message];
  }
};

module.exports = { createCall };
