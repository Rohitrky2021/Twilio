const config = require('../config.js');
const developmentLogger = require('./development.js')();
const productionLogger = require('./production.js')();

let logger = () => {};

switch (config.NODE_ENV) {
  case 'development':
    logger = developmentLogger;
    break;
  case 'production':
    logger = productionLogger;
    break;
}

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = logger;
