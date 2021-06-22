const path = require('path');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['warn', { code: 200 }],
  },
  // overrides: [
  //   {
  //     files: ['store/modules/*.js'],
  //     rules: {
  //       'no-param-reassign': 'off',
  //     },
  //   },
  // ],
};
