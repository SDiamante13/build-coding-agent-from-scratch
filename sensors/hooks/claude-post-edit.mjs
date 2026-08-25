#!/usr/bin/env node
// PostToolUse for Claude Code: the payload names the file, the worktree catches the rest.
import { inspect } from '../scripts/edit-sensors.mjs';
import { editedPaths, readHookPayload } from '../scripts/hook-io.mjs';
import { stamp } from '../scripts/sensor-liveness.mjs';
import { record } from '../scripts/session-ledger.mjs';
import { agentTierFires } from '../scripts/sensor-tier.mjs';
import { changedSinceLastLook } from '../scripts/worktree-watch.mjs';

if (!agentTierFires()) process.exit(0);

const payload = await readHookPayload();

stamp('claude');

const verdict = inspect([
  ...editedPaths(payload),
  ...changedSinceLastLook(payload.session_id),
]);

if (verdict) {
  record(payload.session_id, verdict.files);

  if (!verdict.passed) {
    process.stderr.write(`${verdict.report}\n`);
    process.exit(2);
  }
}
