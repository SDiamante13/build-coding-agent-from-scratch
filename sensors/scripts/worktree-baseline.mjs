#!/usr/bin/env node
// SessionStart for both runtimes: the worktree as it was before the session.
import { readHookPayload } from './hook-io.mjs';
import { baseline } from './worktree-watch.mjs';

const payload = await readHookPayload();

baseline(payload.session_id);
