import _ from 'lodash';
// import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

import { encryptSync } from './services/encryption';
// import Model from './services/model';

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

    if (_.has(item, 'password')) {
      const { hash, salt } = encryptSync(_.get(item, 'password'));
      this.#item.hash = hash;
      this.#item.salt = salt;
    }
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
  async list(ctx) {
    // await ctx.redis.flushall()
    const model = new UserModel();

    const items = await ctx.redis.lrange('users:all', 0, 100);
    const users = await Promise.all(_.map(items, async (item) => {
      const values = await ctx.redis.hmget(item, model.keys);

      return _.zipObject(model.keys, values);
    }));

    ctx.body = users;
  },
  async create(ctx) {
    const { body } = ctx.request;

    const { user } = new UserModel(body);

    // TODO: add validation

    await ctx.redis.multi()
      .hset(`user:${user.id}`, user)
      .hset('users:lookup:all', { [user.email]: user.id, [user.nickname]: user.id })
      .rpush('users:all', `user:${user.id}`)
      .exec();

    ctx.status = 201;
    ctx.body = user;
  },
  async del(ctx) {
    const { id } = ctx.params;
    const key = `user:${id}`;
    const user = await ctx.redis.hgetall(key);
    if (_.isEmpty(user)) ctx.throw(404);

    await Promise.all([
      ctx.redis.del(key),
      ctx.redis.hdel('users:lookup:all', user.email),
      ctx.redis.hdel('users:lookup:all', user.nickname),
      ctx.redis.lrem('users:all', 0, key),
    ]);

    ctx.status = 204;
  },
};
