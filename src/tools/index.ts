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
  return { id: call.id, output: await readFile.run(call.arguments) };
}
