import { spawn } from 'node:child_process';

type Arguments = { readonly command: string };

const MAX_CHARACTERS = 8_000;
const MAX_SECONDS = 30;

export const schema = {
  type: 'function' as const,
  function: {
    name: 'bash',
    description: 'Run a shell command and return its output.',
    parameters: {
      type: 'object',
      properties: { command: { type: 'string', description: 'The command to run' } },
      required: ['command'],
    },
  },
};

export function run(args: string): Promise<string> {
  const { command } = JSON.parse(args) as Arguments;
  const shell = spawn('bash', ['-c', command], { timeout: MAX_SECONDS * 1_000 });
  let output = '';
  const collect = (chunk: Buffer): void => {
    output += chunk.toString();
  };

  shell.stdout.on('data', collect);
  shell.stderr.on('data', collect);

  return new Promise((resolve) => {
    shell.on('close', (code): void => resolve(report(output, code)));
  });
}

function report(output: string, code: number | null): string {
  return `${capped(output)}\n${statusOf(code)}`.trim();
}

function statusOf(code: number | null): string {
  return code === null ? `Killed: it was still running after ${MAX_SECONDS} seconds` : `Exit code: ${code}`;
}

function capped(output: string): string {
  if (output.length <= MAX_CHARACTERS) return output;

  return `${output.slice(0, MAX_CHARACTERS)}\n[cut off after ${MAX_CHARACTERS} characters]`;
}
