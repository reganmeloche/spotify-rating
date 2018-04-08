import axios from 'axios';
import { ensureAuthenticated, getToken } from '../lib/utilities';
import keys from '../../config/keys';

const passport = require('passport');

const scope = ['user-read-email', 'user-read-private', 'user-library-read'];

export default function (app) {
  app.get('/auth', passport.authenticate('spotify', { scope }));

  app.get('/auth/callback', passport.authenticate('spotify', { failureRedirect: '/' }), async (req, res) => {
    console.log('callback cookie: ', req.headers.cookie);
    try {
      const cookieSet = await axios({
        method: 'post',
        url: `${keys.webHost}/cookie`,
        headers: {
          cookie: req.headers.cookie,
        },
      });
    } catch (err) {
      console.log('could not set cookie on web: ', err);
    }
    res.redirect(keys.webHost);
  });

  app.get('/api/user', ensureAuthenticated, (req, res) => {
    res.status(200).json({ user: req.user });
  });

  app.get('/api/logout', async (req, res) => {
    req.logout();
    try {
      const cookieDelete = await axios({
        method: 'delete',
        url: `${keys.webHost}/cookie`,
      });
    } catch (err) {
      console.log('could not delete cookie on web: ', err);
    }
    res.redirect(keys.webHost);
  });

  app.get('/profile', getToken, async (req, res) => {
    let result;
    let status = 400;
    if (req.validToken) {
      try {
        const tokenRes = await axios({
          method: 'get',
          url: `${keys.spotifyRoot}/v1/me`,
          headers: { Authorization: `Bearer ${req.validToken}` },
        });
        result = tokenRes.data;
        status = 200;
      } catch (err) {
        result = err;
      }
    } else {
      result = { error: 'no token' };
    }
    res.status(status).json(result);
  });
}
