module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': [2, 'always'],
    'linebreak-style': 0,
    'max-len': [2, 120],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // for reduce accumulators
          'e', // for e.returnvalue
          'req', // for Express requests
          'request', // for Express requests
          'res', // for Express responses
          'response', // for Express responses
          's', // for vuex
          'socket', // for sockets.io
        ],
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
