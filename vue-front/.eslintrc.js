/* eslint-disable import/no-extraneous-dependencies */
const INLINE_ELEMENTS = require('eslint-plugin-vue/lib/utils/inline-non-void-elements.json');

module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:vue-scoped-css/vue3-recommended',
    '@vue/airbnb',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  ignorePatterns: ['**/*.md'],
  rules: {
    'import/no-cycle': 'warn',
    'max-len': ['warn', { code: 200 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['store', 'state'] }],
    'object-curly-newline': ['error', { ObjectExpression: { consistent: true, multiline: true, minProperties: 5 } }],

    // vue.js additional rules
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 5,
      },
      multiline: {
        max: 1,
      },
    }],
    // NOTE: this can be changed after PR: https://github.com/vuejs/eslint-plugin-vue/issues/827#issuecomment-832733595
    'vue/singleline-html-element-content-newline': ['error', {
      ignores: ['pre', 'textarea', 'p', ...INLINE_ELEMENTS],
    }],
    // NOTE: switched order between methods and LIFECYCLE_HOOKS
    'vue/order-in-components': ['error', {
      order: [
        'el',
        'name',
        'key',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        ['provide', 'inject'],
        'ROUTER_GUARDS',
        'layout',
        'middleware',
        'validate',
        'scrollToTop',
        'transition',
        'loading',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'emits',
        'setup',
        'asyncData',
        'data',
        'fetch',
        'head',
        'computed',
        'watch',
        'watchQuery',
        'methods',
        'LIFECYCLE_HOOKS',
        ['template', 'render'],
        'renderError',
      ],
    }],
  },
};
