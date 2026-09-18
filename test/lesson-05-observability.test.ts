import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { calls, fails, says, tool } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';
import { transcriptOf } from './support/session-log.js';
import { aFileContaining } from './support/temp-file.js';

// The log may be pretty-printed or not, so shape is asserted without the whitespace.
const dense = (text: string): string => text.replaceAll(/\s+/g, '');

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
    // Stringified the way the model sends it, so a Windows path's backslashes come out escaped.
    const toolCall = `read_file ${JSON.stringify({ path: note })}`;

    expect(session.output).toContain(toolCall);
    expect(transcript).toContain('You: where is the shed key?');
    expect(transcript).toContain(toolCall);
    expect(transcript).toContain('Assistant: The shed key is under the mat.');
  });

  it('logs the request it sent, the reply it got back, and what the tool answered', async () => {
    const note = await aFileContaining('the shed key is under the mat');
    const model = await startFakeModel([
      calls(tool('read_file', { path: note })),
      says('The shed key is under the mat.'),
    ]);

    const session = await runAgent({ model, input: 'where is the shed key?\n' });
    await model.close();
    const transcript = await transcriptOf(session);

    expect(dense(transcript)).toContain('"role":"user"');
    expect(dense(transcript)).toContain('"name":"read_file"');
    expect(dense(transcript)).toContain('"finishReason":"tool_calls"');
    expect(transcript).toContain('the shed key is under the mat');
    // Every tool advertised once at startup, not again on the second request.
    const advertised = model.requests[0]?.tools?.length ?? 0;

    expect(dense(transcript).split('"parameters"')).toHaveLength(advertised + 1);
  });

  it('logs why the model call failed before the agent dies of it', async () => {
    const model = await startFakeModel([fails(400, 'that model is not serving requests')]);

    const session = await runAgent({ model, input: 'where is the shed key?\n' });
    await model.close();
    const transcript = await transcriptOf(session);

    expect(transcript).toContain('400');
    expect(transcript).toContain('that model is not serving requests');
    expect(session.exitCode).not.toBe(0);
  });
});
