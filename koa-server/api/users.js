import _ from 'lodash';
import { UserModel } from './models';

export default {
  /**
   * All methods from resource will be called only if `authenticator` method success
   * @type {Boolean}
   */
  protectored: true,
  /**
   * [list description]
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
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
  /**
   * Finds and removes a user from the database by id, if there is no user, returns a 404 error code
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
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
