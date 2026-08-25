#!/usr/bin/env node
// The whole-workspace tier. Same config and coaching as the per-edit tier,
// run from the workspace root so its `files` globs mean what they say.
import { node } from './node-runner.mjs';
import { sensorsPath } from './roots.mjs';

const targets = process.argv.slice(2);

const { output, status } = node([
  sensorsPath('node_modules', 'eslint', 'bin', 'eslint.js'),
  ...(targets.length > 0 ? targets : ['.']),
  '--no-warn-ignored',
  '--config',
  sensorsPath('eslint.config.mjs'),
  '--format',
  sensorsPath('scripts', 'eslint-sensor-formatter.mjs'),
]);

process.stdout.write(`${output}\n`);
process.exit(status ?? 1);
