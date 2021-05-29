console.info('Custom webpack configuration loaded!');

module.export = {
  devServer: {
    // port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/api': '',
        },
        changeOrigin: true,
        logLevel: 'debug',
      },
    },

    // headers: {
    //   'X-Custom-Foo': 'bar',
    // },
    // port: 9000,
    // after(app, server, compiler) {
    //   console.info('Custom webpack configuration merged!');
    //   console.log(app, server, compiler);
    // },
  },
};
