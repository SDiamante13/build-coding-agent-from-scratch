import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';

import { ledgerFile, ledgerRoot } from './ledger-path.mjs';

export function ledgerPath(session) {
  return ledgerFile(session, '.txt');
}

export function record(session, files) {
  if (!session || files.length === 0) return;

  try {
    mkdirSync(ledgerRoot, { recursive: true });
    appendFileSync(ledgerPath(session), files.map((file) => `${file}\n`).join(''));
  } catch {
    // A ledger that cannot be written must not take the agent's turn down with it.
  }
}

export function changedThisSession(session) {
  const ledger = ledgerPath(session);

  if (!session || !existsSync(ledger)) return [];

  return [...new Set(readFileSync(ledger, 'utf8').split('\n').filter(Boolean))];
}
