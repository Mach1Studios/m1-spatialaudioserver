import { writeFile } from 'fs/promises';

import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import multer from '@koa/multer';

import { TrackModel } from './models';

const uploader = multer().any();

export default {
  /**
   * All methods from resource will be called only if `authenticator` method success
   * @type {Boolean}
   */
  protectored: true,
  /**
   * Writing multiple files to fs, generating and saving files id to the DB
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async post(ctx, next) {
    await uploader(ctx, next);

    const tracks = [];
    await Promise.all(_.map(
      ctx.request.files, async (file) => {
        const { track } = new TrackModel(file);
        tracks.push(track);
        // console.log(track);
        return Promise.all([
          writeFile(new URL(`../public/${track.originalname}`, import.meta.url), file.buffer),
          // ctx.redis.set(`file:${track.id}`, track.name),
          ctx.redis.multi()
            .hset(`file:${track.id}`, track)
            .rpush('tracks:all', `file:${track.id}`)
            .exec(),
        ]);
      },
    ));
    ctx.status = 201;
    ctx.body = tracks;
  },
};
