export default () => async (ctx, next) => {
  try {
    await next();
  } catch ({ statusCode = 500, message = 'Unknown error' }) {
    ctx.throw(statusCode, JSON.stringify({ message }));
  }
};
