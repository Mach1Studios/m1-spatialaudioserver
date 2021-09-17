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

    if (ctx.method !== 'OPTIONS') {
      ctx.set('Access-Control-Allow-Origin', origin);
      ctx.set('Access-Control-Allow-Credentials', 'true');

      return next().catch((err) => {
        _.set(err, 'headers.Access-Control-Allow-Origin', origin);
        throw err;
      });
    }

    // ctx.set('Access-Control-Allow-Origin', '*');
    // ctx.set('Access-Control-Allow-Methods', '*');
    // ctx.set('Access-Control-Allow-Headers', '*');

    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Methods', defaultOptions.allowMethods.join(','));
    ctx.set('Access-Control-Allow-Headers', defaultOptions.allowHeaders.join(','));

    ctx.set('Access-Control-Allow-Credentials', 'true');

    ctx.status = 204;
  };
};
