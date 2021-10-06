export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    const { statusCode = 500, message = 'Unknown error' } = error;

    ctx.status = statusCode;
    ctx.body = { message };
  }
};
