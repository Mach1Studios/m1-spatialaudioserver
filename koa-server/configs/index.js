import Koa from 'koa';

import middleware from './middleware';
import Redis from './redis';
import router from './router';

const server = new Koa();
const redis = Redis({ showFriendlyErrorStack: true });

server.keys = ['test'];
server.proxy = true;

server.context.redis = redis;

server.use(middleware(server));

server.use(router.routes());
server.use(router.allowedMethods());

const config = {
  port: process.env.PORT,
};

export { server, config, redis };
