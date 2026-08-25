import path from 'node:path';

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import {
  boundaryImports,
  impureGlobals,
  nondeterminism,
} from './scripts/eslint-rules/design-sensors.mjs';
import { sensorRules } from './scripts/eslint-rules/index.mjs';
import { unusedVars } from './scripts/eslint-rules/unused-vars.mjs';

const maintainabilityRules = {
  'max-lines-per-function': [
    'error',
    { max: 25, skipBlankLines: true, skipComments: true },
  ],
  'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: false }],
  complexity: ['error', 5],
  'max-params': ['error', 4],
  'max-depth': ['error', 2],
  'max-statements': ['error', 15],
  // A statement that computes nothing is how a parameter stops being dead code.
  'no-unused-expressions': ['error', { allowShortCircuit: false, allowTernary: false }],
  'no-void': 'error',
};

const commentRules = {
  'sensors/no-commented-out-code': 'error',
  'sensors/one-line-comment': 'error',
  'sensors/no-stale-reference': 'error',
  'sensors/no-sensor-suppression': 'error',
  'no-warning-comments': [
    'error',
    { terms: ['todo', 'fixme', 'xxx', 'hack'], location: 'anywhere' },
  ],
};

const typeSafetyRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/prefer-as-const': 'error',
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unused-vars': unusedVars,
};

const specSuiteRules = {
  'max-lines-per-function': 'off',
  'max-statements': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
};

export default defineConfig(
  {
    ignores: [
      'node_modules/**',
      'sensors/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'reports/**',
      '.stryker-tmp/**',
      'docs/**',
      '!.claude/**',
      '!.codex/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,ts}'],
    extends: [js.configs.recommended],
    // A rule you can switch off from inside the file it reports is not a rule.
    linterOptions: { noInlineConfig: true },
    languageOptions: { globals: globals.node },
    plugins: { sensors: sensorRules },
    rules: { ...maintainabilityRules, ...commentRules },
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.resolve(import.meta.dirname, '..'),
      },
    },
    plugins: { import: importPlugin },
    rules: {
      ...typeSafetyRules,
      'consistent-return': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'import/no-default-export': 'error',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['test/**/*.{ts,mjs}'],
    rules: specSuiteRules,
  },
  {
    files: ['src/domain/**/*.ts', 'src/ports/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', boundaryImports],
      'no-restricted-globals': ['error', ...impureGlobals],
      'no-restricted-syntax': ['error', ...nondeterminism],
    },
  },
  {
    files: ['test/**/*.{ts,mjs,tsx,jsx}'],
    rules: {
      'sensors/no-mocking-library': 'error',
      'sensors/no-assertion-free-test': 'error',
      'sensors/no-mystery-guest': 'error',
      'sensors/no-branching-test': 'error',
      'sensors/no-looping-test': 'error',
      'sensors/named-arrange': 'error',
      'sensors/no-interaction-assertion': 'error',
    },
  },
);
