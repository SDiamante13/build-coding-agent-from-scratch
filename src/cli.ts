import { createInterface } from 'node:readline/promises';

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const lines = terminal[Symbol.asyncIterator]();

terminal.setPrompt('You: ');

export async function ask(): Promise<string> {
  terminal.prompt();

  const line = await lines.next();

  return line.done ? goodbye() : line.value;
}

export function reply(text: string): void {
  console.log(`Assistant: ${text}`);
}

export function close(): void {
  terminal.close();
}

function goodbye(): never {
  terminal.close();
  process.exit(0);
}
