import Ratings from '../lib/rating';
import { NotFound, ValidationError } from '../lib/errors';
import { handleError } from '../lib/utilities';

// Will probably eventually get the user from the header
export default function (app) {
  app.post('/rating', async (req, res) => {
    try {
      const result = await Ratings.create(req.query.user_id, req.body);
      res.status(201).send(result);
    } catch (err) {
      handleError(err);
      if (err instanceof ValidationError) {
        res.status(400).send(err);
      }
      res.status(500).send(err);
    }
  });

  app.get('/rating', async (req, res) => {
    try {
      const result = await Ratings.getAll(req.query.user_id);
      res.status(200).send(result);
    } catch (err) {
      handleError(err);
      res.status(500).send(err);
    }
  });

  app.get('/rating/:rating_id', async (req, res) => {
    try {
      const result = await Ratings.getById(req.query.user_id, req.params.rating_id);
      res.status(200).send(result);
    } catch (err) {
      handleError(err);
      if (err instanceof NotFound) {
        res.status(404).send(err);
      }
      res.status(500).send(err);
    }
  });

  app.put('/rating/:rating_id', async (req, res) => {
    try {
      const result = await Ratings.update(req.query.user_id, req.params.rating_id, req.body);
      res.status(200).send(result);
    } catch (err) {
      handleError(err);
      if (err instanceof ValidationError) {
        res.status(400).send(err);
      }
      res.status(500).send(err);
    }
  });

  app.delete('/rating/:rating_id', async (req, res) => {
    try {
      await Ratings.deleteRating(req.query.user_id, req.params.rating_id);
      res.status(200).send();
    } catch (err) {
      handleError(err);
      res.status(500).send(err);
    }
  });
}
