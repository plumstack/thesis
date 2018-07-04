module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': [2, "always"],
    'linebreak-style': 0,
    'max-len': [2, 120],
    "no-param-reassign": 0,
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
}
