import _ from 'lodash';
import { PlaylistModel } from './models';

export default {
  /**
   * List of methods that will be called only if `authenticator` method success
   * @type {Array}
   */
  protectored: ['create', 'update', 'del'],
  /**
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async list(ctx) {
    const { user } = ctx.session;

    ctx.body = await new PlaylistModel().getItemsByUserRole(user);
  },
  /**
   * Creating a new playlist by PlaylistModel and save it to DB
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async create(ctx) {
    const { body } = ctx.request;

    const { playlist } = new PlaylistModel(body);

    await ctx.redis.multi()
      .hset(`playlist:${playlist.id}`, playlist)
      .rpush('playlist:all', `playlist:${playlist.id}`)
      .exec();

    ctx.status = 201;
    ctx.body = playlist;
  },
  /**
   * Updating a playlist by playlist id and save it to DB
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    if (_.isEmpty(body)) ctx.throw(400, 'Error! An empty payload was passed to the request');

    const item = await ctx.redis.hgetall(`playlist:${id}`);
    if (_.isNull(item)) ctx.throw(404);

    const payload = new PlaylistModel(item).difference(body);
    if (_.isEmpty(payload)) ctx.throw(400, 'Error! Nothing to change');

    await PlaylistModel
      .initStoreTransaction(item, payload)
      .hset(`playlist:${id}`, payload)
      .exec();

    ctx.body = { ...item, ...payload };
  },
  /**
   * Removing a playlist from DB by playlist id and return empty body with 204;
   * returns 404 if not found
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async remove(ctx) {
    const { id } = ctx.params;
    const key = `playlist:${id}`;
    const playlist = await ctx.redis.hgetall(key);
    if (_.isEmpty(playlist)) ctx.throw(404);

    await Promise.all([
      ctx.redis.del(key),
      ctx.redis.lrem('playlist:all', 0, key),
    ]);

    ctx.status = 204;
  },
};
