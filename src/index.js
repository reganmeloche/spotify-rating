import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// this is required for using async-await
require('babel-polyfill');

const keys = require('../config/keys');

const app = express();

// Setup
app.set('port', (process.env.PORT || 7007));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors middleware
if (keys.useCors) {
  app.use((req, res, next) => {
    if (req.path.indexOf('/api/user/') !== 0) {
      if (!req.headers.referer || (req.headers.referer.indexOf(keys.webHost) !== 0)) {
        res.status(400).send('CORS error');
        return;
      }
    }
    next();
  });
}

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
