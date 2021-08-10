// eslint-disable-next-line
import { readdir, rm } from 'fs/promises';

import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import got from 'got';

const sanitizeId = (...args) => _.map(args, (id) => _.words(id, /[^:]+/g)[1]);

export default {
  /**
   * Scaning and returns a list of available sound files (by match .wav extention)
   * from the public dir
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async list(ctx) {
    // await ctx.redis.flushall();
    let items = await ctx.redis.find('file*', 100);

    if (_.isEmpty(items)) {
      ctx.body = [];

      const files = await readdir(new URL('../public', import.meta.url));
      const tracks = _.filter(files, (file) => _.endsWith(file, '.wav'));

      const body = _.reduce(tracks, (result, track) => _.set(result, `file:${uuid()}`, track), {});
      if (_.isEmpty(body)) return;

      await ctx.redis.mset(body);
      items = await ctx.redis.find('file*', 100);
    }
    const keys = sanitizeId(...items);

    const tracks = await ctx.redis.mget(...items);
    const body = _.zipWith(keys, tracks, (id, name) => ({ id, name }));

    ctx.body = body;
  },
  /**
   * Starting play sound file by id; send a request to the transcoded Nginx server
   *  supported dynamic and static mpeg-dash behavior
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async get(ctx) {
    const { id } = ctx.params;

    const track = await ctx.redis.get(`file:${id}`);
    if (_.isNull(track)) ctx.throw(404);

    // TODO: need to start to store information about prepared cache for file [mpeg-dash manifest];
    // and should be added the status of live broadcast

    await got.get(`http://localhost:8080/play?sound=${track}&id=${id}`).json();
    ctx.status = 202;
  },
  /**
   * Removing a file and its prepared cache from the file system and database
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async del(ctx) {
    const { id } = ctx.params;

    const track = await ctx.redis.getdel(`file:${id}`);
    if (_.isNull(track)) ctx.throw(404);

    const options = { force: true, recursive: true };
    await Promise.all([
      rm(new URL(`../public/preload/${id}`, import.meta.url), options),
      rm(new URL(`../public/${track}`, import.meta.url), options),
    ]);

    ctx.status = 204;
  },
};
