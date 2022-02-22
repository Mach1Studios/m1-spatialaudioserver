module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  rules: {
    'import/no-cycle': 'warn',
    'max-len': ['warn', { code: 200 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['store', 'state'] }],
    'object-curly-newline': ['error', { ObjectExpression: { consistent: true, multiline: true, minProperties: 5 } }],
  },
};
