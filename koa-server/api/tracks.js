// eslint-disable-next-line
import { readdir } from 'fs/promises';

import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import got from 'got';

const sanitizeId = (...args) => _.map(args, (id) => _.words(id, /[^:]+/g)[1]);

export default {
  /**
   * Scans and returns a list of available sound files (by match .wav extention) from the public dir
   * @param  {Object}  ctx  that is the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async list(ctx) {
    // await ctx.redis.flushall();
    let items = await ctx.redis.find('file*', 100);
    if (_.isEmpty(items)) {
      const files = await readdir(new URL('../public', import.meta.url));
      const tracks = _.filter(files, (file) => _.endsWith(file, '.wav'));

      const body = _.reduce(tracks, (result, track) => _.set(result, `file:${uuid()}`, track), {});
      await ctx.redis.mset(body);

      items = await ctx.redis.find('file*', 100);
    }
    const keys = sanitizeId(...items);

    const tracks = await ctx.redis.mget(...items);
    const body = _.zipWith(keys, tracks, (id, name) => ({ id, name }));

    ctx.body = body;
  },
  async get(ctx) {
    const { id } = ctx.params;
    const track = await ctx.redis.get(`file:${id}`);

    if (_.isNull(track)) ctx.throw(404);

    await got.get(`http://localhost:8080/play?sound=${track}&id=${id}`).json();
    ctx.status = 202;
  },
};
