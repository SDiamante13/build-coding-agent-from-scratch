import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { calls, says, tool } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';
import { transcriptOf } from './support/session-log.js';
import { aFileContaining } from './support/temp-file.js';

describe('lesson 5: observability', () => {
  it('shows each tool call and writes the transcript to a session log', async () => {
    const note = await aFileContaining('the shed key is under the mat');
    const model = await startFakeModel([
      calls(tool('read_file', { path: note })),
      says('The shed key is under the mat.'),
    ]);

    const session = await runAgent({ model, input: 'where is the shed key?\n' });
    await model.close();
    const transcript = await transcriptOf(session);

    expect(session.output).toContain(`read_file {"path":"${note}"}`);
    expect(transcript).toContain('You: where is the shed key?');
    expect(transcript).toContain(`read_file {"path":"${note}"}`);
    expect(transcript).toContain('Assistant: The shed key is under the mat.');
  });
});
