import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { calls, says, tool } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';
import { aFileContaining } from './support/temp-file.js';
import { toolResultsIn } from './support/tool-results.js';

describe('lesson 8: edit file', () => {
  it('applies the edit the model asks for', async () => {
    const note = await aFileContaining('the shed key is under the mat');
    const model = await startFakeModel([
      calls(tool('edit_file', { path: note, oldText: 'under the mat', newText: 'in the drawer' })),
      says('The key is in the drawer now.'),
    ]);

    const session = await runAgent({ model, input: 'the key moved to the drawer\n' });
    await model.close();
    const offered = model.requests[0]?.tools ?? [];

    expect(session.output).toContain('Assistant: The key is in the drawer now.');
    expect(offered.map((schema) => schema.function.name)).toContain('edit_file');
    expect(await readFile(note, 'utf8')).toBe('the shed key is in the drawer');
  });

  it('changes nothing when the text to replace is not unique, and says so', async () => {
    const note = await aFileContaining('the key, and the spare key');
    const model = await startFakeModel([
      calls(tool('edit_file', { path: note, oldText: 'key', newText: 'fob' })),
      calls(tool('edit_file', { path: note, oldText: 'spare key', newText: 'spare fob' })),
      says('The spare one, then.'),
    ]);

    const session = await runAgent({ model, input: 'call the spare key a fob\n' });
    await model.close();

    expect(session.output).toContain('Assistant: The spare one, then.');
    expect(await readFile(note, 'utf8')).toBe('the key, and the spare fob');
  });

  it('answers a tool it does not have instead of falling over', async () => {
    const model = await startFakeModel([
      calls(tool('delete_file', { path: 'anything.txt' })),
      says('No such tool, understood.'),
    ]);

    const session = await runAgent({ model, input: 'delete anything.txt\n' });
    await model.close();
    const sentBack = toolResultsIn(model.requests[1]);

    expect(session.output).toContain('Assistant: No such tool, understood.');
    expect(sentBack).toHaveLength(1);
  });
});
