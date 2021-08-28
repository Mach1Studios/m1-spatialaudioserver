// eslint-disable-next-line
// import { readdir, rm } from 'fs/promises';
//
// import _ from 'lodash';
//
// const sanitizeId = (...args) => _.map(args, (id) => _.words(id, /[^:]+/g)[1]);
//
// export default {
//
//   async list(ctx) {
//
//     let items = await ctx.redis.find('id');
//
//     const keys = sanitizeId(...items);
//
//     const users = [
//       {
//         id: 'id',
//         nickname: 'nickname',
//         email: 'email',
//         role: 'role',
//         lastSeen: 'lastSeen',
//       }
//     ];
//     const body = _.zipWith(
//       keys,
//       users,
//       (id, nickname, email, role, lastSeen) => ({ id, nickname, email, role, lastSeen })
//     );
//
//     ctx.body = body;
//   },
// };
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

export default {
  async list(ctx) {
    const users = [
      {
        id: uuid(),
        nickname: 'nickname',
        email: 'email@test.com',
        role: 'admin',
        lastSeen: DateTime.local(),
      },
    ];

    const tests = await ctx.redis.find('user*');
    const list = await ctx.redis.lrange('users:all', 0, 100);
    console.log(tests, list);

    ctx.body = users;
  },
  async create(ctx) {
    const { body } = ctx.request;

    const user = { ...body, id: uuid() };

    await ctx.redis.hset(`user:${user.id}`, user);
    await Promise.all([
      ctx.redis.hset(`user:${user.id}`, user),
      ctx.redis.rpush('users:all', `user:${user.id}`),
    ]);

    // TODO: add validation

    ctx.status = 201;
    ctx.body = user;
  },
};
