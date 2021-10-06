/* eslint-disable consistent-return */
import _ from 'lodash';

export default (options) => {
  const isEnabled = !_.get(options, 'disable', false);

  const defaultOptions = {
    allowMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type', 'Set-Cookie', 'Cookie'],
  };

  return async (ctx, next) => {
    const origin = ctx.get('Origin');
    ctx.vary('Origin');

    if (!origin || !isEnabled) return next();

    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Credentials', 'true');

    if (ctx.method !== 'OPTIONS') {
      return next().catch((err) => {
        _.set(err, 'headers.Access-Control-Allow-Origin', origin);
        _.set(err, 'headers.Access-Control-Allow-Credentials', 'true');

        throw err;
      });
    }

    ctx.set('Access-Control-Allow-Methods', defaultOptions.allowMethods.join(','));
    ctx.set('Access-Control-Allow-Headers', defaultOptions.allowHeaders.join(','));

    ctx.status = 204;
  };
};
