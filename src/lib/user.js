import uuid from 'uuid/v4';
import UsersDAL from '../dal/user';
import { NotFound } from '../lib/errors';

export default class Users {
  static async findOrCreate(model) {
    let result;
    try {
      result = await Users.getByProfileId(model.profileId);
    } catch (err) {
      if (err instanceof NotFound) {
        result = await Users.create(model);
      } else {
        throw err;
      }
    }
    return result;
  }

  static async create(model) {
    const newUser = {
      userId: uuid(),
      email: model.email,
      profileId: model.profileId,
      joinDate: new Date(),
    };
    await UsersDAL.insert(newUser);
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
}
