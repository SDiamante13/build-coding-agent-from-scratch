import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// The agent reads real files, so a test that exercises reading has to hand it one.
export async function aFileContaining(text: string): Promise<string> {
  const folder = await mkdtemp(path.join(tmpdir(), 'coding-agent-'));
  const file = path.join(folder, 'note.txt');

  await writeFile(file, text);

  return file;
}
