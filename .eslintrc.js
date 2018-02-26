module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 5
  },
  extends: ['eslint:recommended'],
  env: {
    browser: true,
    jest: true,
    mocha: true,
    node: true
  },
  rules: {
    'no-console': 0,
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always']
  }
};
