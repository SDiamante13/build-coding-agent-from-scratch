import { existsSync } from 'node:fs';
import path from 'node:path';

import { node } from './node-runner.mjs';
import { projectRoot, sensorsPath } from './roots.mjs';

const eslintBin = sensorsPath('node_modules', 'eslint', 'bin', 'eslint.js');
const prettierBin = sensorsPath('node_modules', 'prettier', 'bin', 'prettier.cjs');
const editConfig = sensorsPath('eslint.edit.config.mjs');
const formatter = sensorsPath('scripts', 'eslint-sensor-formatter.mjs');
const prettierConfig = sensorsPath('.prettierrc.json');

const LINTABLE = /\.(js|mjs|ts)$/;
// The apparatus is vendored, not authored here, so its own findings are not this repo's.
const OUT_OF_SCOPE = /^(node_modules|sensors|dist|build|coverage|logs|docs)(\/|$)/;

function inScope(file) {
  const relative = path.relative(projectRoot, path.resolve(projectRoot, file));
  const reachable = relative !== '' && !relative.startsWith('..');

  if (!reachable || OUT_OF_SCOPE.test(relative)) return null;

  return existsSync(path.join(projectRoot, relative)) ? relative : null;
}

export function scopedFiles(files) {
  return [...new Set(files.map(inScope).filter(Boolean))];
}

export function reformat(files) {
  const { output } = node([
    prettierBin,
    '--config',
    prettierConfig,
    '--ignore-unknown',
    '--write',
    ...files,
  ]);

  return output
    .split('\n')
    .filter((line) => line.includes('ms') && !line.includes('(unchanged)'))
    .map((line) => line.split(' ')[0]);
}

const sensors = [
  {
    name: 'eslint',
    targets: (files) => files.filter((file) => LINTABLE.test(file)),
    run: (targets) =>
      node([
        eslintBin,
        ...targets,
        '--no-warn-ignored',
        '--config',
        editConfig,
        '--format',
        formatter,
      ]),
  },
];

function fire(sensor, files) {
  const targets = sensor.targets(files);

  if (targets.length === 0) return { name: sensor.name, status: 'SKIP', output: '' };

  const { output, status } = sensor.run(targets);

  return { name: sensor.name, status: status === 0 ? 'PASS' : 'FAIL', output };
}

function rollCall(results) {
  return `EDIT SENSORS: ${results.map((r) => `${r.name} ${r.status}`).join(' · ')}`;
}

function formattingNote(reformatted) {
  if (reformatted.length === 0) return [];

  return [`prettier reformatted ${reformatted.join(', ')} — no action needed`];
}

export function inspect(files) {
  const scoped = scopedFiles(files);

  if (scoped.length === 0) return null;

  const reformatted = reformat(scoped);
  const results = sensors.map((sensor) => fire(sensor, scoped));
  const failures = results.filter((result) => result.status === 'FAIL');

  if (failures.length === 0) return { passed: true, files: scoped, report: '' };

  const lines = [rollCall(results), ...formattingNote(reformatted), ''];

  return {
    passed: false,
    files: scoped,
    report: [...lines, ...failures.map((failure) => failure.output)].join('\n'),
  };
}
