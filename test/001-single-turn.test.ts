import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { runAgent } from './support/run-agent.js';

describe('iteration 1: single turn', () => {
  it('answers one prompt and exits', async () => {
    const model = await startFakeModel(['The capital of France is Paris.']);

    const session = await runAgent({
      model,
      input: 'What is the capital of France?\n',
    });
    await model.close();

    expect(session.output).toContain('The capital of France is Paris.');
    expect(session.exitCode).toBe(0);
  });

  it('refuses to start without an API key', async () => {
    const model = await startFakeModel(['never asked']);

    const session = await runAgent({ model, input: 'hello\n', apiKey: null });
    await model.close();

    expect(session.output).toContain('OPENROUTER_API_KEY');
    expect(session.exitCode).not.toBe(0);
  });
});
