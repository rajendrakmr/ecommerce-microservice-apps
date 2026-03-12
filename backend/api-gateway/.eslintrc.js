module.exports = {
  root: true,
  env: {
    node: true,   // Node.js globals like process
    es2021: true, // Modern JS features
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,      // ES2021
    sourceType: 'module', // Keep 'module' if using import/export
  },
  rules: {
    semi: ['error', 'always'],          // require semicolons
    quotes: ['error', 'single'],        // enforce single quotes
    'no-unused-vars': ['warn'],         // warn for unused vars
    'no-console': ['off'],              // allow console.log
    'no-async-promise-executor': ['off'], // sometimes used in async handlers
  },
};