import Ratings from '../lib/rating';
import { NotFound, ValidationError } from '../lib/errors';
import { handleError, ensureAuthenticated } from '../lib/utilities';

// Will probably eventually get the user from the header
export default function (app) {
  app.post('/api/rating', ensureAuthenticated, async (req, res) => {
    try {
      const result = await Ratings.create(req.user.userId, req.body);
      res.status(201).send(result);
    } catch (err) {
      handleError(err);
      if (err instanceof ValidationError) {
        res.status(400).send(err);
      }
      res.status(500).send(err);
    }
  });

  app.get('/api/rating', ensureAuthenticated, async (req, res) => {
    try {
      const result = await Ratings.getAll(req.user.userId);
      res.status(200).send(result);
    } catch (err) {
      handleError(err);
      res.status(500).send(err);
    }
  });

  app.get('/api/rating/:rating_id', ensureAuthenticated, async (req, res) => {
    try {
      const result = await Ratings.getById(req.user.userId, req.params.rating_id);
      res.status(200).send(result);
    } catch (err) {
      handleError(err);
      if (err instanceof NotFound) {
        res.status(404).send(err);
      }
      res.status(500).send(err);
    }
  });

  app.put('/api/rating/:rating_id', ensureAuthenticated, async (req, res) => {
    try {
      const result = await Ratings.update(req.user.userId, req.params.rating_id, req.body);
      res.status(200).send(result);
    } catch (err) {
      handleError(err);
      if (err instanceof ValidationError) {
        res.status(400).send(err);
      }
      res.status(500).send(err);
    }
  });

  app.delete('/api/rating/:rating_id', ensureAuthenticated, async (req, res) => {
    try {
      await Ratings.deleteRating(req.user.userId, req.params.rating_id);
      res.status(200).send();
    } catch (err) {
      handleError(err);
      res.status(500).send(err);
    }
  });
}
