import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const startedAt = new Date().toISOString().replaceAll(':', '-');

export const file = path.join('logs', `session-${startedAt}.log`);

mkdirSync(path.dirname(file), { recursive: true });

export function record(line: string): void {
  appendFileSync(file, `[${new Date().toISOString()}] ${line}\n`);
}

// Only headlines start at column zero, so an editor folds the evidence and grep indexes it.
export function detail(headline: string, body: unknown): void {
  const text = typeof body === 'string' ? body : JSON.stringify(body, null, 2);

  record(`${headline}\n  ${text.replaceAll('\n', '\n  ')}`);
}
