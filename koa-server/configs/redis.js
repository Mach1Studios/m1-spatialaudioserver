import _ from 'lodash';
import Redis from 'ioredis';

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

  client.on('ready', () => {
    console.log('Connected to redis!');
  });
  client.on('error', (e) => {
    process.nextTick(() => {
      throw e;
    });
  });

  return client;
};
