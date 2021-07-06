module.exports = {
  transpileDependencies: ['mach1spatial-decode'],
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        // eslint-disable-next-line
        options.compilerOptions = {
          ...options.compilerOptions,
          isCustomElement: (tag) => tag.startsWith('ion-'),
        };
        return options;
      });
  },
};
