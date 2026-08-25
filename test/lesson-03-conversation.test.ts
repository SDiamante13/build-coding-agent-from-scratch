import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { says } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';

describe('lesson 3: conversation', () => {
  it('sends every earlier message back with the next prompt', async () => {
    const model = await startFakeModel([
      says('Nice to meet you, Steven.'),
      says('Your name is Steven.'),
    ]);

    const session = await runAgent({
      model,
      input: 'My name is Steven.\nWhat is my name?\n',
    });
    await model.close();
    const resent = model.requests[1]?.messages ?? [];

    expect(session.output).toContain('Assistant: Your name is Steven.');
    expect(resent).toHaveLength(3);
    expect(resent[0]?.content).toBe('My name is Steven.');
    expect(resent[1]?.content).toBe('Nice to meet you, Steven.');
    expect(resent[2]?.content).toBe('What is my name?');
  });
});
