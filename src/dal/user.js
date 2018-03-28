import { queryNone, queryOne } from './sqlHelper';

export default class User {
  static async insert(model) {
    const myQuery = `
      INSERT INTO users (
        user_id,
        profile_id,
        email,
        join_date
      )
      VALUES ($1, $2, $3, $4);
    `;
    const qVals = [
      model.userId,
      model.profileId,
      model.email,
      model.joinDate,
    ];
    return queryNone(myQuery, qVals);
  }

  static async getByUserId(userId) {
    let result = null;
    const myQuery = `
      SELECT * 
      FROM users
      WHERE user_id = $1;
    `;
    const qVals = [userId];
    const dbResult = await queryOne(myQuery, qVals);
    if (dbResult) {
      result = User.convert(dbResult);
    }
    return result;
  }

  static async getByProfileId(profileId) {
    let result = null;
    const myQuery = `
      SELECT * 
      FROM users
      WHERE profile_id = $1;
    `;
    const qVals = [profileId];
    const dbResult = await queryOne(myQuery, qVals);
    if (dbResult) {
      result = User.convert(dbResult);
    }
    return result;
  }

  static async deleteByUserId(userId) {
    const myQuery = `
      DELETE FROM users
      WHERE user_id = $1;
    `;
    const qVals = [userId];
    await queryOne(myQuery, qVals);
  }

  static convert(dbModel) {
    return {
      userId: dbModel.user_id,
      profileId: dbModel.profile_id,
      email: dbModel.email,
      joinDate: dbModel.join_date,
    };
  }
}
