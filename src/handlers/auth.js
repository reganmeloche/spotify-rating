import axios from 'axios';
import { ensureAuthenticated, getToken } from '../lib/utilities';
import keys from '../../config/keys';

const passport = require('passport');

const scope = ['user-read-email', 'user-read-private', 'user-library-read'];

export default function (app) {
  app.get('/auth', passport.authenticate('spotify', { scope }));

  app.get('/auth/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/user');
  });

  app.get('/user', ensureAuthenticated, (req, res) => {
    res.status(200).json({ user: req.user });
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
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
