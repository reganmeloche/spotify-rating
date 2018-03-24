const passport = require('passport');

const scope = ['user-read-email', 'user-read-private'];

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  res.redirect('/');
}

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
}
