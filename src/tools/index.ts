import * as cli from '../cli.js';
import * as log from '../log.js';

import * as readFile from './read-file.js';

export type ToolCall = {
  readonly id: string;
  readonly name: string;
  readonly arguments: string;
};

export type ToolResult = {
  readonly id: string;
  readonly output: string;
};

export const schemas = [readFile.schema];

export async function run(call: ToolCall): Promise<ToolResult> {
  cli.using(call.name, call.arguments);

  const startedAt = Date.now();
  const output = await readFile.run(call.arguments);

  log.detail(`<-- ${call.name} answered after ${Date.now() - startedAt}ms`, output);

  return { id: call.id, output };
}
