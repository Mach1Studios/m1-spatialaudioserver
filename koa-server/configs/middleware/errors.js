export default () => async (ctx, next) => {
  try {
    await next();
  } catch ({ statusCode = 500, message = 'Unknown error' }) {
    ctx.status = statusCode;
    ctx.body = { message };
  }
};
