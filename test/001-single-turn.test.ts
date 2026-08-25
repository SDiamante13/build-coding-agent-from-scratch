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
});
