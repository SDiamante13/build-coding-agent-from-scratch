import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { dirtyPaths } from './git-changes.mjs';
import { ledgerFile, ledgerRoot } from './ledger-path.mjs';

const projectRoot = path.resolve(import.meta.dirname, '..');

const HARNESS_FIXTURE = /^test\/scratch\/|__sensor-fixture__/;

// Why the suite sees its own fixtures and a live session does not: context/test-isolation.md
function suiteIsWatching() {
  return Boolean(process.env.VITEST);
}

function theAgentsOwnWork(file) {
  return suiteIsWatching() || !HARNESS_FIXTURE.test(file);
}

function stampOf(file) {
  const full = path.join(projectRoot, file);

  return existsSync(full) ? statSync(full).mtimeMs : 0;
}

export function snapshot() {
  return Object.fromEntries(
    dirtyPaths()
      .filter(theAgentsOwnWork)
      .map((file) => [file, stampOf(file)]),
  );
}

export function movedFiles(before, after) {
  return Object.keys(after).filter((file) => before[file] !== after[file]);
}

function snapshotPath(session) {
  return ledgerFile(session, '.worktree.json');
}

function remember(session, taken) {
  try {
    mkdirSync(ledgerRoot, { recursive: true });
    writeFileSync(snapshotPath(session), JSON.stringify(taken));
  } catch {
    // A snapshot that cannot be written must not take the agent's turn down.
  }
}

export function baseline(session) {
  remember(session, snapshot());
}

export function changedSinceLastLook(session) {
  const stored = snapshotPath(session);
  const before = existsSync(stored) ? JSON.parse(readFileSync(stored, 'utf8')) : null;
  const after = snapshot();

  remember(session, after);

  return before === null ? [] : movedFiles(before, after);
}
