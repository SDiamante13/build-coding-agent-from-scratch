import { spawnSync } from 'node:child_process';

import { projectRoot } from './roots.mjs';

const RENAMED = /[RC]/;

// -z, because git quotes and escapes any path with a space in the human format.
function records() {
  const seen = spawnSync(
    'git',
    ['status', '--porcelain', '--untracked-files=all', '-z'],
    { cwd: projectRoot, encoding: 'utf8' },
  );

  return (seen.stdout ?? '').split('\0').filter(Boolean);
}

export function changes() {
  const entries = records();
  const seen = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];

    seen.push({ status: entry.slice(0, 2), path: entry.slice(3) });
    // A rename spends a second record on the path it came from.
    if (RENAMED.test(entry.slice(0, 2))) index += 1;
  }

  return seen;
}

export function dirtyPaths() {
  return changes().map((change) => change.path);
}

export function deletedPaths() {
  return changes()
    .filter((change) => change.status.includes('D'))
    .map((change) => change.path);
}
