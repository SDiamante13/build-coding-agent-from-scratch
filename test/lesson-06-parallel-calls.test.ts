import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { calls, says, tool } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';
import { aFileContaining } from './support/temp-file.js';
import { toolResultsIn } from './support/tool-results.js';

describe('lesson 6: parallel calls', () => {
  it('runs every tool call in one reply, not just the first', async () => {
    const shed = await aFileContaining('the shed key is under the mat');
    const bike = await aFileContaining('the bike lock is 1234');
    const model = await startFakeModel([
      calls(tool('read_file', { path: shed }), tool('read_file', { path: bike })),
      says('Key under the mat, lock 1234.'),
    ]);

    const session = await runAgent({ model, input: 'what do my notes say?\n' });
    await model.close();
    const sentBack = toolResultsIn(model.requests[1]);

    expect(session.output).toContain('Assistant: Key under the mat, lock 1234.');
    expect(sentBack).toHaveLength(2);
    expect(sentBack[0]?.content).toBe('the shed key is under the mat');
    expect(sentBack[1]?.content).toBe('the bike lock is 1234');
    expect(sentBack[1]?.tool_call_id).toBe('call_2');
  });
});
