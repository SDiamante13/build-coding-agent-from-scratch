import * as cli from '../cli.js';

import * as editFile from './edit-file.js';
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

type Runner = (args: string) => Promise<string>;

export const schemas = [readFile.schema, editFile.schema];

const runners: Record<string, Runner> = { read_file: readFile.run, edit_file: editFile.run };

export function run(toolCalls: readonly ToolCall[]): Promise<ToolResult[]> {
  return Promise.all(toolCalls.map(runOne));
}

async function runOne(call: ToolCall): Promise<ToolResult> {
  cli.using(call.name, call.arguments);

  return { id: call.id, output: await outputOf(call) };
}

function outputOf(call: ToolCall): Promise<string> {
  const runner = runners[call.name];

  return runner ? runner(call.arguments) : Promise.resolve(`There is no tool called ${call.name}.`);
}
