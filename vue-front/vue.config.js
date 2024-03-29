// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const anchor = require('markdown-it-anchor');

module.exports = {
  transpileDependencies: ['mach1spatial-decode'],
  // configureWebpack: {
  //   plugins: [
  //     new BrowserSyncPlugin(
  //       // BrowserSync options
  //       {
  //         // browse to http://localhost:3000/ during development
  //         host: 'localhost',
  //         port: 3000,
  //         // proxy the Webpack Dev Server endpoint
  //         // (which should be serving on http://localhost:3100/)
  //         // through BrowserSync
  //         proxy: 'http://localhost:8081/',
  //       },
  //       // plugin options
  //       {
  //         // prevent BrowserSync from reloading the page
  //         // and let Webpack Dev Server take care of this
  //         reload: false,
  //       },
  //     ),
  //   ],
  // },
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
      },
    },
  },
  runtimeCompiler: true,
  chainWebpack: (config) => {
    /**
     * Rewriting default path for .wasm module for the 'mach1spatial-decode'
     * It can change and in package too into "locateFile" function
     * {@link https://github.com/rustwasm/wasm-pack/pull/705#issuecomment-623016429}
     * {@link https://gist.github.com/surma/b2705b6cca29357ebea1c9e6e15684cc}
     */
    config.module
      .rule('wasm')
      .type('javascript/auto')
      .test(require.resolve('mach1spatial-decode/lib/Mach1Decode.wasm'))
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .options({
        name: 'Mach1Decode.wasm',
        outputPath: 'js',
        publicPath: 'js',
      })
      .end();

    // config.module
    //   .rule('yaml')
    //   // .type('json')
    //   .test(/\.yaml$/)
    //   // .use('json-loader')
    //   // .loader(require.resolve('json-loader'))
    //   // .end()
    //   .use('yaml-loader')
    //   .loader(require.resolve('yaml-loader'))
    //   .options({
    //     // asJSON: true,
    //   })
    //   .end();

    config.module
      .rule('markdown')
      .test(/\.md$/)

      .use('vue-loader')
      .loader('vue-loader')
      .end()

      .use('vue-md-loader')
      .loader(require.resolve('vue-md-loader'))
      .options({
        plugins: [
          [
            anchor,
            {
              permalink: anchor.permalink.headerLink(),
            },
          ],
        ],
      })
      .end();
  },
};
