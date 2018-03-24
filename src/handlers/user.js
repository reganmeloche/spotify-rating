import Users from '../lib/user';
import { NotFound, ValidationError } from '../lib/errors';
import { handleError } from '../lib/utilities';

export default function (app) {
  app.post('/user', async (req, res) => {
    try {
      const result = await Users.create(req.body);
      res.status(201).send(result);
    } catch (err) {
      handleError(err);
      if (err instanceof ValidationError) {
        res.status(400).send(err);
      }
      res.status(500).send(err);
    }
  });

  app.get('/user/:user_id', async (req, res) => {
    try {
      const result = await Users.getByUserId(req.params.user_id);
      res.status(200).send(result);
    } catch (err) {
      handleError(err);
      if (err instanceof NotFound) {
        res.status(404).send(err);
      }
      res.status(500).send(err);
    }
  });

  app.delete('/user/:user_id', async (req, res) => {
    try {
      await Users.deleteUser(req.params.user_id);
      res.status(200).send();
    } catch (err) {
      handleError(err);
      res.status(500).send(err);
    }
  });
}
