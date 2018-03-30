import rating from './rating';
import user from './user';
import auth from './auth';
import album from './album';

export default function (app) {
  rating(app);
  user(app);
  auth(app);
  album(app);
}
