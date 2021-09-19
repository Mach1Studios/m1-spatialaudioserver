import _ from 'lodash';

import { UserModel } from './services/model';
import service from './services/encryption';

export default {
  async get(ctx) {
    const { id } = ctx.params;
    if (id !== 'profile') ctx.throw(404);

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
  async post(ctx) {
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
    };
  },
};
