import keys from '../../config/keys';
import Users from '../lib/user';

// eslint-disable-next-line  import/prefer-default-export
export function handleError(err) {
  /* istanbul ignore next */
  if (keys.displayError) {
    // eslint-disable-next-line no-console
    console.log('ERROR LOG EVENT:', err);
  }
}

export function ensureAuthenticated(req, res, next) {
  console.log('CHECKING AUTH', req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log('IS AUTH, going home');
    next();
  } else {
    console.log('NOT AUTHD ,redirect to root');
    res.redirect('/');
  }
}

export async function getToken(req, res, next) {
  if (req.isAuthenticated()) {
    req.validToken = await Users.checkValidToken(req.user.userId);
    next();
  } else {
    res.redirect('/');
  }
}
