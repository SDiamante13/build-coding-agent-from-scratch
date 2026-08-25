import { createHash } from 'node:crypto';
import path from 'node:path';

import { sensorsPath } from './roots.mjs';

export const ledgerRoot = sensorsPath('reports', 'ledger');

const SAFE_NAME = /^[A-Za-z0-9_-]{1,128}$/;

// Collapsing every rejected id to one name would make unrelated sessions share state.
function safely(session) {
  if (SAFE_NAME.test(session)) return session;

  return `session-${createHash('sha256').update(session).digest('hex').slice(0, 32)}`;
}

// A session id arrives in a hook payload and ends up naming a file.
export function safeSessionName(session) {
  const named = typeof session === 'string' && session.length > 0;

  return named ? safely(session) : 'unidentified';
}

export function ledgerFile(session, suffix) {
  return path.join(ledgerRoot, `${safeSessionName(session)}${suffix}`);
}
