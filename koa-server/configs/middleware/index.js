import path from 'path';

import compose from 'koa-compose';

import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import serve from 'koa-static';

import cors from './cors';

const dirServe = path.join(__dirname, '../..', 'www');

export default function middleware() {
  const dependencies = [
    logger(),
    cors(),
    bodyparser(),
    serve(dirServe),
  ];

  return compose(dependencies);
}
