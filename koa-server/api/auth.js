import _ from 'lodash';

import { UserModel } from './models';
import service from './services/encryption';

export default {
  /**
   * Authenticating user by login (it can be nickname for email) and password;
   * if login success adding user profile into session
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async login(ctx) {
    const { body: { login, password } } = ctx.request;

    const id = await ctx.redis.hget('users:lookup:all', login);
    if (_.isNull(id)) ctx.throw(404, 'User with such credentials was not found');

    const user = await ctx.redis.hgetall(`user:${id}`);
    const isValid = await service.validate(password, user.hash, user.salt);

    if (!isValid) ctx.throw(401, 'Incorrect login or password');

    ctx.session.user = _.pick(user, new UserModel().keys);

    ctx.status = 201;
    ctx.body = {
      user: ctx.session.user,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3NTkwNjQ2ODN9.Q_SaMOmv0hufgKI9DBdYMBKnszyB7lHKMxs8egmfdSg',
    };
  },
  /**
   * Simple logout handler; Removing user sessions and redirect them to root
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async logout(ctx) {
    ctx.session = null;
    ctx.status = 204;
  },
  async validate(ctx, next) {
    const { user } = ctx.session;
    if (_.get(user, 'role') === 'admin') {
      ctx.status = 204;
      await next();
    } else {
      ctx.throw(401, 'Permission deny');
    }
  },
};
