// The per-edit tier's config: eslint.config.mjs plus the red-green relaxation.
import baseConfig from './eslint.config.mjs';
import { unusedVarsInLoop } from './scripts/eslint-rules/unused-vars.mjs';

// Two blocks: .ts takes the rule from typescript-eslint, .mjs from base ESLint.
export default [
  ...baseConfig,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    rules: { '@typescript-eslint/no-unused-vars': unusedVarsInLoop },
  },
  {
    files: ['src/**/*.mjs', 'test/**/*.mjs', 'scripts/**/*.mjs'],
    rules: { 'no-unused-vars': unusedVarsInLoop },
  },
];
