import path from 'path';

import compose from 'koa-compose';

import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import serve from 'koa-static';
import session from 'koa-session';

import validator from 'node-input-validator';

import cors from './cors';
import errors from './errors';

const dirServe = path.join(__dirname, '../..', 'www');

export default function middleware(application) {
  const dependencies = [
    logger(),
    cors(),
    errors(),
    session(application),
    bodyparser(),
    validator.koa(),
    serve(dirServe),
  ];

  return compose(dependencies);
}
