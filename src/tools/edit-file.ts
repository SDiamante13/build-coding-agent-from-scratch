import { readFile, writeFile } from 'node:fs/promises';

type Arguments = { readonly path: string; readonly oldText: string; readonly newText: string };

export const schema = {
  type: 'function' as const,
  function: {
    name: 'edit_file',
    description:
      'Make exact, unique text replacements in a UTF-8 file. Read the file first; after a mismatch, re-read it and submit fresh exact text.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path of the file to edit' },
        oldText: { type: 'string', description: 'Exact text to replace, appearing once in the file' },
        newText: { type: 'string', description: 'Text to put in its place' },
      },
      required: ['path', 'oldText', 'newText'],
    },
  },
};

export async function run(args: string): Promise<string> {
  const { path, oldText, newText } = JSON.parse(args) as Arguments;
  const before = await readFile(path, 'utf8');
  const matches = before.split(oldText).length - 1;

  if (matches !== 1) return `Found ${matches} of that text in ${path}; it has to appear exactly once.`;

  await writeFile(path, before.replace(oldText, newText));

  return `Edited ${path}`;
}
