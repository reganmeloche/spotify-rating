import keys from '../../config/keys';
import Users from '../lib/user';

const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const callbackURL = `${keys.host}/auth/callback`;

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser((userId, done) => {
  Users.getByUserId(userId)
    .then((user) => {
      done(null, user);
    });
});

passport.use(new SpotifyStrategy(
  {
    clientID: keys.clientId,
    clientSecret: keys.clientSecret,
    callbackURL,
    passReqToCallback : true,
    // proxy: true, // maybe remove
  },
  async (accessToken, refreshToken, expiresIn, profile, done) => {
    let err = null;
    let user;
    let email = '';
    if (profile.emails && profile.emails.length > 0) {
      email = profile.emails[0].value;
    }
    try {
      user = await Users.findOrCreate({
        profileId: profile.id,
        email,
        accessToken,
        refreshToken,
        expiresIn,
      });
    } catch (error) {
      err = error;
    }
    return done(err, user);
  },
));
