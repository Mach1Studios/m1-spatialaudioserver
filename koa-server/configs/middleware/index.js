import path from 'path';

import compose from 'koa-compose';
import logger from 'koa-logger';
import serve from 'koa-static';

const dirServe = path.join(__dirname, '../..', 'www');

export default function middleware() {
  const dependencies = [
    logger(),
    serve(dirServe),
  ];

  return compose(dependencies);
}
