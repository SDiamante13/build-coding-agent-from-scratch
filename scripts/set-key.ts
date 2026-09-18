// Prompts for your OpenRouter API key, checks it works, and writes it into .env. Called by ./setup
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

interface KeyCheck {
  ok: boolean;
  message: string;
  credit: string | null;
}

console.log('\nNeed a key? Create one at https://openrouter.ai/keys\n');
const key = (await promptForKey()).trim();

if (!key) {
  console.log('\nNo key entered. Nothing written.\n');
  process.exit(1);
}

console.log('Checking key with OpenRouter...');
const check = await verifyKey(key);

if (!check.ok) {
  console.log(`FAIL  ${check.message}\n\n      Nothing written.\n`);
  process.exit(1);
}

writeKey(key);
console.log(`pass  OpenRouter key verified${check.credit ? ` — ${check.credit} credit remaining` : ''}`);
console.log('pass  Saved OPENROUTER_API_KEY to .env\n');

async function promptForKey(): Promise<string> {
  const query = 'Paste your OpenRouter API key: ';
  return stdin.isTTY ? promptHidden(query) : promptPlain(query);
}

async function promptPlain(query: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(query);
  rl.close();
  return answer;
}

const ctrlC = '';

// No echo at all while typing — simplest way to keep the key off the screen.
function promptHidden(query: string): Promise<string> {
  stdout.write(query);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');

  return new Promise((resolve) => {
    let value = '';
    const onData = (char: string): void => {
      if (char === '\n' || char === '\r') return finish(onData, resolve, value);
      if (char === ctrlC) process.exit(1);
      value = char === '' || char === '\b' ? value.slice(0, -1) : value + char;
    };
    stdin.on('data', onData);
  });
}

function finish(onData: (chunk: string) => void, resolve: (value: string) => void, value: string): void {
  stdin.setRawMode(false);
  stdin.pause();
  stdin.removeListener('data', onData);
  stdout.write('\n');
  resolve(value);
}

// A cheap round-trip against OpenRouter's key-info endpoint: no tokens spent, just a check.
async function verifyKey(key: string): Promise<KeyCheck> {
  const response = await fetch('https://openrouter.ai/api/v1/key', {
    headers: { Authorization: `Bearer ${key}` },
  });
  const body: unknown = await response.json().catch(() => ({}));

  if (!response.ok) return { ok: false, message: errorMessage(body, response.status), credit: null };

  return { ok: true, message: '', credit: creditRemaining(body) };
}

function errorMessage(body: unknown, status: number): string {
  const error = isRecord(body) ? body.error : undefined;
  const message = isRecord(error) && typeof error.message === 'string' ? error.message : null;
  return message ?? `OpenRouter rejected the key (HTTP ${status}).`;
}

function creditRemaining(body: unknown): string | null {
  const data = isRecord(body) ? body.data : undefined;
  const remaining = isRecord(data) ? data.limit_remaining : undefined;
  return typeof remaining === 'number' ? `$${remaining.toFixed(2)}` : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Starts from the existing .env so any model you have already customised survives.
function writeKey(key: string): void {
  const source = existsSync('.env') ? '.env' : '.env.example';
  const env = readFileSync(source, 'utf8').replace(/^OPENROUTER_API_KEY=.*$/m, `OPENROUTER_API_KEY=${key}`);
  writeFileSync('.env', env);
}
