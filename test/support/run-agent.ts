import { spawn } from 'node:child_process';
import path from 'node:path';

import type { FakeModel } from './fake-model.js';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');

export type Session = {
  readonly output: string;
  readonly exitCode: number | null;
};

export type Run = {
  readonly model: FakeModel;
  readonly input: string;
};

// Spawned rather than imported, so the test says nothing about how the agent is built.
export function runAgent({ model, input }: Run): Promise<Session> {
  const agent = spawn('npx', ['tsx', 'src/index.ts'], {
    cwd: projectRoot,
    env: {
      ...process.env,
      OPENROUTER_API_KEY: 'test-key',
      OPENROUTER_BASE_URL: model.url,
      OPENROUTER_MODEL: 'fake/model',
    },
  });

  let output = '';

  agent.stdout.on('data', (chunk: Buffer) => (output += chunk.toString()));
  agent.stderr.on('data', (chunk: Buffer) => (output += chunk.toString()));
  agent.stdin.end(input);

  return new Promise((resolve) => {
    agent.on('close', (exitCode) => {
      resolve({ output, exitCode });
    });
  });
}
