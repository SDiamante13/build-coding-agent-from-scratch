import { createInterface } from 'node:readline/promises';

import * as log from './log.js';

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const lines = terminal[Symbol.asyncIterator]();

terminal.setPrompt('You: ');
console.log(`Session log: ${log.file}`);

export async function ask(): Promise<string> {
  terminal.prompt();

  const line = await lines.next();

  return line.done ? goodbye() : heard(line.value);
}

export function reply(text: string): void {
  say(`Assistant: ${text}`);
}

export function using(name: string, args: string): void {
  say(`→ ${name} ${args}`);
}

function heard(userInput: string): string {
  log.record(`You: ${userInput}`);

  return userInput;
}

function say(line: string): void {
  console.log(line);
  log.record(line);
}

function goodbye(): never {
  terminal.close();
  process.exit(0);
}
