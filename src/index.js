import express from 'express';
import bodyParser from 'body-parser';

// this is required for using async-await
require('babel-polyfill');

const keys = require('../config/keys');

const app = express();

// Setup
app.set('port', (process.env.PORT || 7007));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to add userId to request object
app.use('/', (req, res, next) => {
  if (req.headers.userid) {
    req.userId = req.headers.userid;
  }
  next();
});

// Routes
require('./handlers/_routes').default(app);

// Start the server
const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${app.get('port')}`);
});

module.exports = server;
