import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { calls, says, tool } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';
import { aFileContaining } from './support/temp-file.js';
import { toolResultsIn } from './support/tool-results.js';

describe('lesson 7: tool call loop', () => {
  it('keeps running tool calls until a reply comes back without any', async () => {
    const shed = await aFileContaining('the shed key is under the mat');
    const bike = await aFileContaining('the bike lock is 1234');
    const model = await startFakeModel([
      calls(tool('read_file', { path: shed })),
      calls(tool('read_file', { path: bike })),
      says('Key under the mat, lock 1234.'),
    ]);

    const session = await runAgent({ model, input: 'read my notes one at a time\n' });
    await model.close();
    const sentBack = toolResultsIn(model.requests[2]);

    expect(session.output).toContain('Assistant: Key under the mat, lock 1234.');
    expect(model.requests).toHaveLength(3);
    expect(sentBack).toHaveLength(2);
    expect(sentBack[1]?.content).toBe('the bike lock is 1234');
  });
});
