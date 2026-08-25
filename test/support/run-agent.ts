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
  readonly apiKey?: string | null;
};

function environment(model: FakeModel, apiKey: string | null): NodeJS.ProcessEnv {
  const inherited: NodeJS.ProcessEnv = {
    ...process.env,
    OPENROUTER_BASE_URL: model.url,
    OPENROUTER_MODEL: 'fake/model',
  };

  if (apiKey === null) {
    delete inherited.OPENROUTER_API_KEY;

    return inherited;
  }

  return { ...inherited, OPENROUTER_API_KEY: apiKey };
}

// Spawned rather than imported, so the test says nothing about how the agent is built.
export function runAgent({ model, input, apiKey = 'test-key' }: Run): Promise<Session> {
  const agent = spawn('npx', ['tsx', 'src/index.ts'], {
    cwd: projectRoot,
    env: environment(model, apiKey),
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
