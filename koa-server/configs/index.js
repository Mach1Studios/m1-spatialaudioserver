import Koa from 'koa';

import middleware from './middleware';
import router from './router';

const server = new Koa();

server.use(middleware(server));

server.use(router.routes());
server.use(router.allowedMethods());

const config = {
  port: process.env.PORT,
};

export { server, config };