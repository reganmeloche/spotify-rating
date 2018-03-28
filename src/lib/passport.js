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
    // proxy: true ??
  },
  async (accessToken, refreshToken, expiresIn, profile, done) => {
    let err = null;
    let user;
    try {
      user = await Users.findOrCreate({
        profileId: profile.id,
        email: profile.emails[0].value,
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
