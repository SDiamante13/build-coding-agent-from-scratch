import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const stampRoot = path.resolve(import.meta.dirname, '..', 'reports', 'ledger');

function stampPath(runtime) {
  return path.join(stampRoot, `.last-${runtime}`);
}

export function stamp(runtime, at = Date.now()) {
  mkdirSync(stampRoot, { recursive: true });
  writeFileSync(stampPath(runtime), String(at));
}

export function lastSeen(runtime) {
  const file = stampPath(runtime);

  if (!existsSync(file)) return null;

  const at = Number(readFileSync(file, 'utf8').trim());

  return Number.isFinite(at) ? at : null;
}
