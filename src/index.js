import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';

const cors = require('cors');

// this is required for using async-await
require('babel-polyfill');

const keys = require('../config/keys');

const app = express();

const whitelist = [keys.webHost];
const corsOptions = {
  origin: (origin, callback) => {
    console.log('ORIGIN', origin);
    if (whitelist.indexOf(origin) !== -1 || origin == undefined) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
// app.use(cors(corsOptions));

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
