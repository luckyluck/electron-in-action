module.exports = {
  extends: [
    'airbnb',
    'prettier',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  env: {
    browser: true,
    node: true,
  },
  plugins: ['react-hooks', 'jsx-a11y'],
  rules: {
    'import/prefer-default-export': 'off',
    'react/prop-types': [2, { skipUndeclared: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
};
