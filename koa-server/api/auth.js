import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import service from './services/encryption';

class UserModel {
  #keys = []

  #item = {}

  #setModelKey(source, path, defaultValue) {
    this.#keys = _.union(this.#keys, [path]);
    return _.get(source, path, defaultValue);
  }

  constructor(item) {
    this.#item.id = this.#setModelKey(item, 'id', uuid());
    this.#item.nickname = this.#setModelKey(item, 'nickname');
    this.#item.email = this.#setModelKey(item, 'email');
    this.#item.role = this.#setModelKey(item, 'role', 'user');
    this.#item.lastSeen = this.#setModelKey(item, 'lastSeen');

    // if (_.has(item, 'password')) {
    //   const { hash, salt } = encryptSync(_.get(item, 'password'));
    //   this.#item.hash = hash;
    //   this.#item.salt = salt;
    // }
  }

  get user() {
    return { ...this.#item };
  }

  get keys() {
    return _.uniq(this.#keys);
  }

  static validate() {
    // TODO: should store standart validation object
    return null;
  }
}

export default {
  async post(ctx) {
    const { body: { login, password } } = ctx.request;

    const id = await ctx.redis.hget('users:lookup:all', login);
    if (_.isNull(id)) ctx.throw(404, 'User with such credentials was not found');

    const user = await ctx.redis.hgetall(`user:${id}`);
    const isValid = await service.validate(password, user.hash, user.salt);

    if (!isValid) ctx.throw(401, 'Incorrect login or password');

    const session = uuid();
    await ctx.redis.set(`session:${session}`, user.id);

    ctx.status = 201;
    ctx.body = {
      session,
      user: _.pick(user, new UserModel().keys),
    };
  },
};
