import path from 'path';

import compose from 'koa-compose';

import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import serve from 'koa-static';

const dirServe = path.join(__dirname, '../..', 'www');

export default function middleware() {
  const dependencies = [
    logger(),
    bodyparser(),
    serve(dirServe),
  ];

  return compose(dependencies);
}
