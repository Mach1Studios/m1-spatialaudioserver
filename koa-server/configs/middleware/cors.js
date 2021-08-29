/* eslint-disable consistent-return */
import _ from 'lodash';

export default (options) => {
  const isEnabled = !_.get(options, 'disable', false);

  const defaultOptions = {
    allowMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type'],
  };

  return async (ctx, next) => {
    const origin = ctx.get('Origin');
    ctx.vary('Origin');

    if (!origin || !isEnabled) return next();
    if (ctx.method !== 'OPTIONS') {
      ctx.set('Access-Control-Allow-Origin', origin);
      return next();
    }

    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Methods', defaultOptions.allowMethods.join(','));
    ctx.set('Access-Control-Allow-Headers', defaultOptions.allowHeaders.join(','));

    ctx.status = 204;
  };
};
