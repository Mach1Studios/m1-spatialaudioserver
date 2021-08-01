import { writeFile } from 'fs/promises';

import _ from 'lodash';
import { v4 as uuid } from 'uuid';

export default {
  async post(ctx) {
    await Promise.all(_.map(
      ctx.request.files, async (file) => Promise.all([
        writeFile(new URL(`../public/${file.originalname}`, import.meta.url), file.buffer),
        ctx.redis.set(`file:${uuid()}`, file.originalname),
      ]),
    ));
    ctx.status = 200;
  },
};
