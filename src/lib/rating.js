import uuid from 'uuid/v4';
import UserRatingsDAL from '../dal/userRating';
import { NotFound, ValidationError } from '../lib/errors';

export default class Ratings {
  static validate(model) {
    if (model.rating < 0 || model.rating > 10) {
      throw new ValidationError('Rating must be between 0 and 10');
    }
  }

  static async create(userId, model) {
    Ratings.validate(model);

    const newRating = {
      ratingId: uuid(),
      albumName: model.albumName,
      artist: model.artist,
      createDate: new Date(),
      rating: model.rating,
      comments: model.comments,
      faveSongs: model.faveSongs,
    };

    await UserRatingsDAL.insert(userId, newRating);
    return newRating;
  }

  static async update(userId, ratingId, model) {
    Ratings.validate(model);

    const updatedRating = {
      albumName: model.albumName,
      artist: model.artist,
      rating: model.rating,
      comments: model.comments,
      faveSongs: model.faveSongs,
    };

    await UserRatingsDAL.update(userId, ratingId, updatedRating);
    return updatedRating;
  }

  static async getById(userId, ratingId) {
    const result = await UserRatingsDAL.getByUserIdAndRatingId(userId, ratingId);
    if (!result) {
      throw new NotFound('Rating not found');
    }
    return result;
  }

  static async getAll(userId) {
    return UserRatingsDAL.getByUserId(userId);
  }

  static async deleteRating(userId, ratingId) {
    await UserRatingsDAL.deleteByUserIdAndRatingId(userId, ratingId);
  }
}
