// eslint.config.js
import { FlatCompat } from "@eslint/eslintrc";

// FlatCompat allows old config rules to work
const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommended: true,
});

export default [
  ...compat.extends("eslint:recommended"), // basic recommended rules
  {
    files: ["**/*.js"], // target all JS files
    rules: { 
      semi: ["error", "always"],   // enforce semicolons
      "no-unused-vars": ["warn"],  // warn about unused variables
      "no-console": ["off"],        // allow console.log
    },
  },
];