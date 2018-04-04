import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';

// this is required for using async-await
require('babel-polyfill');

const keys = require('../config/keys');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

// Setup session
const { sessionHours } = keys;
app.enable('trust proxy', 1);
app.use(cookieSession({
  maxAge: sessionHours * 60 * 60 * 1000,
  keys: [keys.cookieKey],
  secure: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Setup
app.set('port', (process.env.PORT || 7007));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ home: 'hello there' });
});

// Routes
require('./lib/passport');
require('./handlers/_routes').default(app);

// Start the server
const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${app.get('port')}`);
});

module.exports = server;
