import { writeFile } from 'fs/promises';

import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import multer from '@koa/multer';

const uploader = multer().any();

export default {
  protectored: true,

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
