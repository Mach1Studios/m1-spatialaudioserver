import service from './services/encryption';

export default {
  async post(ctx) {
    const { body: { login, password } } = ctx.request;

    const id = await ctx.redis.hget('users:lookup:all', login);
    console.log(id);
  }
}
