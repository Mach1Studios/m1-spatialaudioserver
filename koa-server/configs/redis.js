import { readdir, stat } from 'fs/promises';

import _ from 'lodash';
import Redis from 'ioredis';

import { TrackModel, UserModel } from '../api/models';

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

export default (options) => {
  const client = new Redis({ host: redisHost, port: redisPort, ...options });

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

    const [tracks, user] = await Promise.all([client.find('track*', 100), client.find('user*', 100)]);
    if (_.isEmpty(tracks)) {
      console.info('Empty tracks directory. Scanning...');
      const files = await readdir(new URL('../public', import.meta.url));
      const items = _.filter(files, (file) => _.endsWith(file, '.wav'));

      if (_.isEmpty(items)) {
        console.info('Nothing 🎶 was found. You can upload a new track in the admin dashboard');
      } else {
        const body = await Promise.all(_.map(items, async (originalname) => {
          const { size } = await stat(new URL(`../public/${originalname}`, import.meta.url));
          const { track } = new TrackModel({ mimetype: 'audio/wav', originalname, size });

          await client.multi()
            .hset(`track:${track.id}`, track)
            .rpush('tracks:all', `track:${track.id}`)
            .exec();
          return track;
        }));
        console.info(`Found and stored ${body.length} 🎶`);
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
