require('babel-polyfill');

import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// Setup
app.set('port', (process.env.PORT || 7007));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
require('./handlers/_routes').default(app);

// Start the server
const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${app.get('port')}`);
});

module.exports = server;
