import { readFile } from 'node:fs/promises';

type Arguments = { readonly path: string };

export const schema = {
  type: 'function' as const,
  function: {
    name: 'read_file',
    description: 'Read a file and return its contents.',
    parameters: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Path of the file to read' } },
      required: ['path'],
    },
  },
};

export function run(args: string): Promise<string> {
  const { path } = JSON.parse(args) as Arguments;

  return readFile(path, 'utf8');
}
