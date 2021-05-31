import _ from 'lodash';
import { writeFile } from 'fs/promises';

export default {
  async post(ctx) {
    await Promise.all(_.map(ctx.request.files, async (file) => writeFile(new URL(`../public/${file.originalname}`, import.meta.url), file.buffer)));
    ctx.status = 200;
  },
};
