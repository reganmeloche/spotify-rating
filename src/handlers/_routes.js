import rating from './rating';
import user from './user';
import auth from './auth';

export default function (app) {
  rating(app);
  user(app);
  auth(app);
}
