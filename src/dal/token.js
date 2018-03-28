import { queryNone, queryOne } from './sqlHelper';

export default class Token {
  static async upsert(model) {
    const myQuery = `
      INSERT INTO tokens (
        user_id,
        access_token,
        access_token_expiry,
        refresh_token,
        refresh_token_expiry
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE 
      SET access_token = EXCLUDED.access_token,
          access_token_expiry = EXCLUDED.access_token_expiry,
          refresh_token = EXCLUDED.refresh_token,
          refresh_token_Expiry = EXCLUDED.refresh_token_expiry;
    `;
    const qVals = [
      model.userId,
      model.accessToken,
      model.accessTokenExpiry,
      model.refreshToken,
      model.refreshTokenExpiry,
    ];
    return queryNone(myQuery, qVals);
  }

  static async getByUserId(userId) {
    let result = null;
    const myQuery = `
      SELECT * 
      FROM tokens
      WHERE user_id = $1;
    `;
    const qVals = [userId];
    const dbResult = await queryOne(myQuery, qVals);
    if (dbResult) {
      result = Token.convert(dbResult);
    }
    return result;
  }

  static async deleteByUserId(userId) {
    const myQuery = `
      DELETE FROM tokens
      WHERE user_id = $1;
    `;
    const qVals = [userId];
    await queryOne(myQuery, qVals);
  }

  static convert(dbModel) {
    return {
      userId: dbModel.user_id,
      accessToken: dbModel.access_token,
      accessTokenExpiry: dbModel.access_token_expiry,
      refreshToken: dbModel.refresh_token,
      refreshTokenExpiry: dbModel.refresh_token_expiry,
    };
  }
}
