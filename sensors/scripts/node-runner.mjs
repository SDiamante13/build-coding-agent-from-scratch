import { spawnSync } from 'node:child_process';

import { projectRoot } from './roots.mjs';

export function node(args, environment = {}, timeout = 0) {
  const result = spawnSync(process.execPath, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    env: { ...process.env, ...environment },
    ...(timeout > 0 ? { timeout, killSignal: 'SIGKILL' } : {}),
  });

  return {
    output: [result.stdout, result.stderr].filter(Boolean).join('').trim(),
    status: result.status,
    timedOut: Boolean(result.signal),
  };
}
