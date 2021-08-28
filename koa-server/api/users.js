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
