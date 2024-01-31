require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const http = require('http');

const app = require('./app');
const logger = require('./utils/logger');
const { sequelize } = require('./db/models');
const registerSchedules = require('./crons');

const server = http.createServer(app);
const port = process.env.BACKEND_SERVICE_PORT;
const NODE_ENV = process.env.NODE_ENV || 'development';

registerSchedules();

sequelize
  .sync()
  .then(() => {
    logger.info('[CONNECTED TO DATABASE]');
    server.listen(port, () =>
      logger.info(
        `[BACKEND-SERVICE (http) LISTENING ON PORT:${port} ENV:${NODE_ENV}]`
      )
    );
  })
  .catch((err) => {
    logger.error('Failed to connect to db', err);
  });
