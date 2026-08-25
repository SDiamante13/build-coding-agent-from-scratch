import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { says } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';

describe('lesson 1: single turn', () => {
  it('answers one prompt and exits', async () => {
    const model = await startFakeModel([says('The capital of France is Paris.')]);

    const session = await runAgent({
      model,
      input: 'What is the capital of France?\n',
    });
    await model.close();

    expect(session.output).toContain('Assistant: The capital of France is Paris.');
    expect(session.exitCode).toBe(0);
  });

  it('refuses to start without an API key', async () => {
    const model = await startFakeModel([says('never asked')]);

    const session = await runAgent({ model, input: 'hello\n', apiKey: null });
    await model.close();

    expect(session.output).toContain('OPENROUTER_API_KEY');
    expect(session.exitCode).not.toBe(0);
  });
});
