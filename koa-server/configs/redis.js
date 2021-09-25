import { readdir } from 'fs/promises';

import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import Redis from 'ioredis';

import { UserModel } from '../api/models';

export default (options) => {
  const client = new Redis(options);

  Redis.prototype.find = (match, count = 100) => new Promise((resolve) => {
    let items = [];
    client.scanStream({ match, count })
      .on('data', (part) => {
        items = _.union(items, part);
      })
      .on('end', () => {
        resolve(items);
      });
  });

  client.on('ready', async () => {
    console.info('Connected to redis!');

    const [tracks, user] = await Promise.all([client.find('file*', 100), client.find('user*', 100)]);
    if (_.isEmpty(tracks)) {
      console.info('Empty tracks directory. Scanning...');
      const files = await readdir(new URL('../public', import.meta.url));
      const items = _.filter(files, (file) => _.endsWith(file, '.wav'));

      const body = _.reduce(items, (result, track) => _.set(result, `file:${uuid()}`, track), {});
      if (_.isEmpty(body)) {
        console.info('Nothing 🎶 was found. You can upload a new track in the admin dashboard');
      } else {
        console.info(`Found ${Object.keys(body).length} 🎶`);
        await client.mset(body);
      }
    }
    if (_.isEmpty(user)) {
      console.info('Creating a new "admin" user...');
      const model = new UserModel({
        nickname: 'm1',
        email: 'support@mach1.tech',
        role: 'admin',
        password: 'goodpassbro',
      });
      await client.multi()
        .hset(`user:${model.user.id}`, model.user)
        .hset('users:lookup:all', { [model.user.email]: model.user.id, [model.user.nickname]: model.user.id })
        .rpush('users:all', `user:${model.user.id}`)
        .exec();
    }
  });
  client.on('error', (e) => {
    process.nextTick(() => {
      throw e;
    });
  });

  return client;
};
