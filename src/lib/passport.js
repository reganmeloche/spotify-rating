import keys from '../../config/keys';
import Users from '../lib/user';

const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const callbackURL = `${keys.host}/auth/callback`;

passport.serializeUser((user, done) => {
  console.log('SERIALIZE', user);
  done(null, user);
  //done(null, user.userId);
});

passport.deserializeUser((user, done) => {
  console.log('attempting to deserialize: ', user);
  Users.getByUserId(user.userId)
    .then((user) => {
      console.log('DESERIALIZE', user);
      done(null, user);
    });
    
});

passport.use(new SpotifyStrategy(
  {
    clientID: keys.clientId,
    clientSecret: keys.clientSecret,
    callbackURL,
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
