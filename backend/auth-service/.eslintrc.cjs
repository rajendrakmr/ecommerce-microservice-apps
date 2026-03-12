module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  extends: [
    'eslint:recommended'
  ],
  rules: { 
    semi: ['error', 'always'],         // Always semicolons
    indent: ['error', 2],              // 2 spaces indentation
    'no-unused-vars': ['warn'],        // Warn for unused vars
    'no-console': 'off'                // Allow console.log
  }
};