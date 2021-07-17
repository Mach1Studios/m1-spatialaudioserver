import Redis from 'ioredis';

export default (options) => {
  const client = new Redis(options);

  // client.on('ready', () => {
  //   console.log('Connected to redis!');
  // });
  // client.on('error', (e) => {
  //   process.nextTick(() => {
  //     throw e;
  //   });
  // });

  return client;
};
