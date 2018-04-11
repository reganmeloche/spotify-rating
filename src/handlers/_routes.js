import rating from './rating';
import user from './user';
import album from './album';

export default function (app) {
  rating(app);
  user(app);
  album(app);
}
