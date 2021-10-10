import _ from 'lodash';

export default {
  /**
   * Checking and returning current user session: if exist return 200 else empty body and 204.
   * Removing session object if a session was corrupted
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async get(ctx) {
    const { user } = ctx.session;
    const userId = _.get(user, 'id');

    ctx.status = userId ? 200 : 204;
    ctx.body = { user };

    if (userId) {
      const profile = await ctx.redis.hget(`user:${userId}`, 'id');

      if (_.isNull(profile)) {
        ctx.session = null;
        ctx.throw(403, 'Session expired');
      }
    }
  },
}
