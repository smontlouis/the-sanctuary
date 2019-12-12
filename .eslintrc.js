module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'no-return-assign': 'off',
    'prettier/prettier': [
      "error",
      {
        "trailingComma": "none",
        "singleQuote": true,
        "jsxSingleQuote": false,
        "printWidth": 100,
        "semi": false,
        "jsxBracketSameLine": true
      }
    ]
  }
}
