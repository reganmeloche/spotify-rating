import Albums from '../lib/album';
import { handleError } from '../lib/utilities';

export default function (app) {
  app.get('/api/albums', async (req, res) => {
    try {
      const result = await Albums.getRecent(req.userId);
      res.status(200).send(result);
    } catch (err) {
      handleError(err);
      res.status(500).send(err);
    }
  });
}
