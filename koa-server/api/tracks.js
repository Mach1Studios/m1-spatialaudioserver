// eslint-disable-next-line
import { readdir } from 'fs/promises';

import _ from 'lodash';

export default {
  async get(ctx) {
    const files = await readdir(new URL('../public', import.meta.url));
    const tracks = _.filter(files, (file) => _.endsWith(file, '.wav'));

    ctx.body = tracks;
  },
};
