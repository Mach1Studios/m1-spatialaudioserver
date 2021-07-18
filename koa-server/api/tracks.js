// eslint-disable-next-line
import { readdir } from 'fs/promises';

import _ from 'lodash';
import { v4 as uuid } from 'uuid';

export default {
  /**
   * Scans and returns a list of available sound files (by match .wav extention) from the public dir
   * @param  {Object}  ctx  that is the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async list(ctx) {
    const items = await ctx.redis.find('file*', 100);

    if (!_.isEmpty(items)) {
      const tracks = await ctx.redis.mget(...items);
      const body = _.zipWith(items, tracks, (id, name) => ({ id, name }));

      ctx.body = body;
      return;
    }

    const files = await readdir(new URL('../public', import.meta.url));
    const tracks = _.filter(files, (file) => _.endsWith(file, '.wav'));

    const body = _.reduce(tracks, (result, track) => _.set(result, `file:${uuid()}`, track), {});
    ctx.body = body;

    await ctx.redis.mset(body);
  },
  async get(ctx) {
    const { id } = ctx.params;
    console.log('select file', id);
  },
};
