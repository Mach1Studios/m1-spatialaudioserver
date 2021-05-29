import _ from 'lodash';

export default (options) => {
  const isEnabled = !_.get(options, 'disable', false);

  return async (ctx, next) => {
    const origin = ctx.get('Origin');
    if (!origin || !isEnabled) return next();

    if (ctx.method === 'OPTIONS') {
      throw new Error("Options doesn't support on this moment, full cors should implement...");
    } else {
      ctx.set('Access-Control-Allow-Origin', origin);

      return next();
    }
  };
};
