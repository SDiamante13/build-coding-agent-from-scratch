import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const startedAt = new Date().toISOString().replaceAll(':', '-');

export const file = path.join('logs', `session-${startedAt}.log`);

mkdirSync(path.dirname(file), { recursive: true });

export function record(line: string): void {
  appendFileSync(file, `${line}\n`);
}
