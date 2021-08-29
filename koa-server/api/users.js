import _ from 'lodash';
// import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

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

    this.#item.password = _.get(item, 'password');
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

    const user = { ...body, id: uuid() };

    await ctx.redis.hset(`user:${user.id}`, user);
    await Promise.all([
      ctx.redis.hset(`user:${user.id}`, user),
      ctx.redis.rpush('users:all', `user:${user.id}`),
    ]);

    // TODO: add validation

    ctx.status = 201;
    ctx.body = user;
  },
  async del(ctx) {
    const { id } = ctx.params;
    const key = `user:${id}`;

    const [user] = await Promise.all([ctx.redis.del(key), ctx.redis.lrem('users:all', 0, key)]);
    if (user === 0) ctx.throw(404);

    ctx.status = 204;
  },
};
