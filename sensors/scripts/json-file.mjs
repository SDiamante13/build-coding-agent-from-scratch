import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

// Sensor state that cannot be read must not take the agent's turn down with it.
export function readJsonOr(file, fallback = null) {
  if (!existsSync(file)) return fallback;

  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

export function writeJsonOrGiveUp(file, value, root) {
  try {
    mkdirSync(root, { recursive: true });
    writeFileSync(file, JSON.stringify(value));
  } catch {
    // Same rule in the other direction: a ledger nobody can write is not fatal.
  }
}
