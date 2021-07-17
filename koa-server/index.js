/* eslint-disable no-console */
import Redis from 'ioredis';
import { server, config } from './configs';

(async () => {
  try {
    const client = new Redis(config.redis);

    client.on('connect', () => {
      console.log(`Connecting to redis "${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}"...`);
    });

    client.on('ready', () => {
      console.log('Connected to redis!');
    });

    client.on('error', (e) => {
      process.nextTick(() => {
        throw e;
      });
    });
  } catch (e) {
    console.log(e);
  }

  server.listen(config.port, () => {
    console.log(`🚀 Server listening on port ${config.port}!`);
    if (process.env.NODE_ENV === 'development') {
      console.info(`You can open API on this URI: http://localhost:${config.port}`);
    }
  });
})();
