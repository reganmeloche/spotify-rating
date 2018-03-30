import Albums from '../lib/album';
import { handleError, ensureAuthenticated } from '../lib/utilities';

export default function (app) {
  app.get('/albums', ensureAuthenticated, async (req, res) => {
    try {
      const result = await Albums.getRecent(req.user.userId);
      res.status(200).send(result);
    } catch (err) {
      handleError(err);
      res.status(500).send(err);
    }
  });
}
