import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { calls, says, tool } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';

describe('lesson 10: coding system prompt', () => {
  it('puts a system prompt in front of the conversation', async () => {
    const model = await startFakeModel([says('Read first, then edit.')]);

    const session = await runAgent({ model, input: 'how do you work?\n' });
    await model.close();
    const sent = model.requests[0]?.messages ?? [];

    expect(session.output).toContain('Assistant: Read first, then edit.');
    expect(sent[0]?.role).toBe('system');
    expect(sent[0]?.content?.length ?? 0).toBeGreaterThan(0);
    expect(sent[1]).toMatchObject({ role: 'user', content: 'how do you work?' });
  });

  it('sends the one prompt on every request, however the turn goes', async () => {
    const model = await startFakeModel([
      calls(tool('bash', { command: 'echo hello' })),
      says('It printed hello.'),
      says('Yes, hello.'),
    ]);

    const session = await runAgent({ model, input: 'run that echo\nwhat did it print?\n' });
    await model.close();
    const last = model.requests[2]?.messages ?? [];

    expect(session.output).toContain('Assistant: Yes, hello.');
    expect(model.requests.map((request) => request.messages[0]?.role)).toEqual(['system', 'system', 'system']);
    expect(last.filter((message) => message.role === 'system')).toHaveLength(1);
  });
});
