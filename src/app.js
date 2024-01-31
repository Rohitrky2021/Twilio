//Packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./utils/logger');

const app = express();

// Middlewares
app.use(
  cors({
    // origin: ['*'],
  })
);

app.use(helmet());
app.use(express.json({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);
app.use(morgan('common', { stream: logger.stream }));

// Routes imports
const v1Routes = require('./routes/v1');

// Routes
app.use('/v1', v1Routes);

app.get('/', (_, res) => {
  res.status(200).send('Backend up and running');
});

module.exports = app;
