import parser from 'co-busboy';

// const uploader = async () => {}

// TODO: just need to move this to text
export default {
  async post(ctx) {
    // console.log(ctx.request.rawBody);
    const body = await parser(ctx, {
      autoFields: true,
      // checkFile(...args) {
      //   // console.log(args);
      // }
    });

    console.log(body.fields);
    // let file;
    // while (file = yeild body()) {
    //   console.log(file);
    // }

    // for (const file of body) {
    //   console.log(file);
    // }
    ctx.status = 200;
  },
};
