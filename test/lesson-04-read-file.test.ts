import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { calls, says, tool } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';
import { aFileContaining } from './support/temp-file.js';
import { toolResultsIn } from './support/tool-results.js';

describe('lesson 4: read file', () => {
  it('runs the tool call the model asks for and answers from the contents', async () => {
    const note = await aFileContaining('the shed key is under the mat');
    const model = await startFakeModel([
      calls(tool('read_file', { path: note })),
      says('The shed key is under the mat.'),
    ]);

    const session = await runAgent({ model, input: 'where is the shed key?\n' });
    await model.close();
    const offered = model.requests[0]?.tools ?? [];
    const sentBack = toolResultsIn(model.requests[1]);

    expect(session.output).toContain('Assistant: The shed key is under the mat.');
    expect(offered[0]?.function.name).toBe('read_file');
    expect(sentBack[0]?.content).toBe('the shed key is under the mat');
  });
});
