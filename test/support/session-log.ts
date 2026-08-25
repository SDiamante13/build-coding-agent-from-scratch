import { readFile } from 'node:fs/promises';

import type { Session } from './run-agent.js';

const LOG_LINE = /Session log: (\S+)/;

export function transcriptOf(session: Session): Promise<string> {
  const file = LOG_LINE.exec(session.output)?.[1];

  if (!file) throw new Error(`the agent never said where its log is:\n${session.output}`);

  return readFile(file, 'utf8');
}
