import { createInterface } from 'node:readline/promises';

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const lines = terminal[Symbol.asyncIterator]();

// terminal.prompt() pauses the input, and Node 24 drops a line already buffered when it does.
export async function ask(): Promise<string> {
  process.stdout.write('You: ');

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
