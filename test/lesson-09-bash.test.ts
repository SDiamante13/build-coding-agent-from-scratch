import { describe, expect, it } from 'vitest';

import { startFakeModel } from './support/fake-model.js';
import { calls, says, tool } from './support/model-script.js';
import { runAgent } from './support/run-agent.js';
import { toolResultsIn } from './support/tool-results.js';

describe('lesson 9: bash', () => {
  it('runs the command and hands the output back to the model', async () => {
    const model = await startFakeModel([
      calls(tool('bash', { command: 'echo the-shed-key-is-under-the-mat' })),
      says('It printed the-shed-key-is-under-the-mat.'),
    ]);

    const session = await runAgent({ model, input: 'run that echo\n' });
    await model.close();
    const offered = model.requests[0]?.tools ?? [];
    const sentBack = toolResultsIn(model.requests[1]);

    expect(session.output).toContain('Assistant: It printed the-shed-key-is-under-the-mat.');
    expect(offered.map((schema) => schema.function.name)).toContain('bash');
    expect(sentBack[0]?.content).toContain('the-shed-key-is-under-the-mat');
  });

  it('answers a failing command with what it printed and the exit code', async () => {
    const model = await startFakeModel([
      calls(tool('bash', { command: 'echo no-such-target >&2; exit 3' })),
      says('That target is missing.'),
    ]);

    const session = await runAgent({ model, input: 'run the build\n' });
    await model.close();
    const sentBack = toolResultsIn(model.requests[1]);

    expect(session.output).toContain('Assistant: That target is missing.');
    expect(sentBack[0]?.content).toContain('no-such-target');
    expect(sentBack[0]?.content).toContain('Exit code: 3');
  });

  it('cuts off an output far too big to send', async () => {
    const model = await startFakeModel([
      calls(tool('bash', { command: "head -c 40000 /dev/zero | tr '\\0' x" })),
      says('That was a wall of x.'),
    ]);

    const session = await runAgent({ model, input: 'print the whole log\n' });
    await model.close();
    const sentBack = toolResultsIn(model.requests[1]);

    expect(session.output).toContain('Assistant: That was a wall of x.');
    expect(sentBack[0]?.content?.length ?? 0).toBeLessThan(40000);
    expect(sentBack[0]?.content).toContain('cut off');
  });

  it('answers a tool that throws instead of dying with it', async () => {
    const model = await startFakeModel([
      calls(tool('read_file', { path: 'no/such/file.txt' })),
      says('There is no file at that path.'),
    ]);

    const session = await runAgent({ model, input: 'read no/such/file.txt\n' });
    await model.close();
    const sentBack = toolResultsIn(model.requests[1]);

    expect(session.output).toContain('Assistant: There is no file at that path.');
    expect(sentBack[0]?.content).toContain('ENOENT');
    expect(session.exitCode).toBe(0);
  });
});
