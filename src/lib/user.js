import uuid from 'uuid/v4';
import axios from 'axios';
import moment from 'moment';
import UsersDAL from '../dal/user';
import TokensDAL from '../dal/token';
import { NotFound, AuthError } from '../lib/errors';
import keys from '../../config/keys';

export default class Users {
  static async create(model) {
    // Save user
    const newUser = {
      userId: uuid(),
      email: model.email,
      profileId: model.profileId,
      joinDate: moment().format(),
    };
    await UsersDAL.insert(newUser);

    // Save token info
    const accessTokenExpiry = moment().add(model.expiresIn, 'seconds').format();
    const newToken = {
      userId: newUser.userId,
      accessToken: model.accessToken,
      refreshToken: model.refreshToken,
      accessTokenExpiry,
      refreshTokenExpiry: accessTokenExpiry, // change this
    };
    await TokensDAL.upsert(newToken);
    return newUser;
  }

  static async getByUserId(userId) {
    const result = await UsersDAL.getByUserId(userId);
    if (!result) {
      throw new NotFound('User not found');
    }
    return result;
  }

  static async getByProfileId(profileId) {
    const result = await UsersDAL.getByProfileId(profileId);
    if (!result) {
      throw new NotFound('User not found');
    }
    return result;
  }

  static async deleteUser(userId) {
    await UsersDAL.deleteByUserId(userId);
  }

  static async checkValidToken(userId) {
    let result = null;
    const token = await TokensDAL.getByUserId(userId);
    if (token) {
      if (moment(token.accessTokenExpiry) > moment()) {
        result = token.accessToken;
      } else {
        const newToken = await Users.refreshToken(token);
        result = newToken.accessToken;
      }
      return result;
    }
    throw new AuthError('Access token not found');
  }

  // Use refresh token to request a new access token
  static async refreshToken(token) {
    let result = null;
    try {
      // Make call to spotify account api with refresh token
      const res = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
          client_id: keys.clientId,
          client_secret: keys.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Build and save new token
      const body = res.data;
      const accessTokenExpiry = moment().add(body.expires_in, 'seconds').format();
      const newToken = {
        userId: token.userId,
        accessToken: body.access_token,
        accessTokenExpiry,
        refreshToken: body.refresh_token || token.refreshToken,
        refreshTokenExpiry: accessTokenExpiry, // This is not currently used
      };
      await TokensDAL.upsert(newToken);
      result = newToken;
    } catch (err) {
      throw new AuthError('Could not refresh token');
    }
    return result;
  }
}
