import { writeFile } from 'fs/promises';

import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import multer from '@koa/multer';

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
    await Promise.all(_.map(
      ctx.request.files, async (file) => Promise.all([
        writeFile(new URL(`../public/${file.originalname}`, import.meta.url), file.buffer),
        ctx.redis.set(`file:${uuid()}`, file.originalname),
      ]),
    ));
    ctx.status = 200;
  },
};
