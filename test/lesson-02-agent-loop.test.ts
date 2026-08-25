import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { says } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';

describe('lesson 2: agent loop', () => {
  it('answers every prompt until the input ends', async () => {
    const model = await startFakeModel([says('Paris.'), says('Berlin.')]);

    const session = await runAgent({
      model,
      input: 'capital of France?\ncapital of Germany?\n',
    });
    await model.close();

    expect(session.output).toContain('Paris.');
    expect(session.output).toContain('Berlin.');
    expect(model.requests).toHaveLength(2);
    expect(session.exitCode).toBe(0);
  });
});
