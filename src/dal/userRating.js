import { queryAll, queryNone, queryOne } from './sqlHelper';

export default class UserRating {
  static async insert(userId, model) {
    const myQuery = `
      INSERT INTO user_ratings (
        user_id,
        rating_id,
        album_name,
        artist,
        create_date,
        listen_date,
        rating,
        comments,
        fave_songs
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;
    const qVals = [
      userId,
      model.ratingId,
      model.albumName,
      model.artist,
      model.createDate,
      model.listenDate,
      model.rating,
      model.comments,
      model.faveSongs,
    ];
    return queryNone(myQuery, qVals);
  }

  static async update(userId, ratingId, model) {
    const myQuery = `
      UPDATE user_ratings 
      SET album_name = $3,
          artist = $4,
          rating = $5,
          listen_date = $6,
          comments = $7,
          fave_songs = $8
      WHERE user_id = $1
      AND   rating_id = $2;
    `;
    const qVals = [
      userId,
      ratingId,
      model.albumName,
      model.artist,
      model.rating,
      model.listenDate,
      model.comments,
      model.faveSongs,
    ];
    return queryNone(myQuery, qVals);
  }

  static async getByUserIdAndRatingId(userId, ratingId) {
    let result = null;
    const myQuery = `
      SELECT * 
      FROM user_ratings
      WHERE user_id = $1
      AND   rating_id = $2;
    `;
    const qVals = [userId, ratingId];
    const dbResult = await queryOne(myQuery, qVals);
    if (dbResult) {
      result = UserRating.convert(dbResult);
    }
    return result;
  }

  static async getByUserId(userId) {
    const myQuery = `
      SELECT * 
      FROM user_ratings
      WHERE user_id = $1
      ORDER BY create_date DESC;
    `;
    const qVals = [userId];
    const dbResult = await queryAll(myQuery, qVals);
    return dbResult.map(x => UserRating.convert(x));
  }

  static async deleteByUserIdAndRatingId(userId, ratingId) {
    const myQuery = `
      DELETE FROM user_ratings
      WHERE user_id = $1
      AND rating_id = $2;
    `;
    const qVals = [userId, ratingId];
    await queryOne(myQuery, qVals);
  }

  static convert(dbModel) {
    return {
      ratingId: dbModel.rating_id,
      albumName: dbModel.album_name,
      artist: dbModel.artist,
      createDate: dbModel.create_date,
      listenDate: dbModel.listen_date,
      rating: dbModel.rating,
      comments: dbModel.comments,
      faveSongs: dbModel.fave_songs,
    };
  }
}
