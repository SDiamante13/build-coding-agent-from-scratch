import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { STOP_BUDGET, tooTightToReport } from './hook-budgets.mjs';
import { deadHooks } from './registered-hooks.mjs';
import { lastSeen } from './sensor-liveness.mjs';

const projectRoot = path.resolve(import.meta.dirname, '..');

const CODEX_NOTE = [
  'Codex asks for a one-time approval the first time a hook fires. Until you',
  'approve it, nothing runs and nothing says so — no events, no ledger, no error.',
  'Silence before approval is indistinguishable from silence after a clean edit.',
];

const runtimes = [
  {
    key: 'claude',
    name: 'Claude Code',
    manifest: '.claude/settings.json',
    adapter: '.claude/hooks/post-edit-sensor.mjs',
    note: [],
  },
  {
    key: 'codex',
    name: 'Codex CLI',
    manifest: '.codex/hooks.json',
    adapter: '.codex/hooks/post-edit-sensor.mjs',
    note: CODEX_NOTE,
  },
];

function wiredTo(manifest, adapter) {
  const full = path.join(projectRoot, manifest);

  return existsSync(full) && readFileSync(full, 'utf8').includes(adapter);
}

function examine(runtime) {
  return {
    ...runtime,
    wired: wiredTo(runtime.manifest, runtime.adapter),
    installed: existsSync(path.join(projectRoot, runtime.adapter)),
    firedAt: lastSeen(runtime.key),
  };
}

function when(at) {
  return at === null
    ? 'never'
    : new Date(at).toISOString().replace('T', ' ').slice(0, 16);
}

function mark(ok) {
  return ok ? 'ok' : 'MISSING';
}

function describe(state) {
  const lines = [
    `  ${state.name}`,
    `    manifest    ${state.manifest}  ${mark(state.wired)}`,
    `    adapter     ${state.adapter}  ${mark(state.installed)}`,
    `    last fired  ${when(state.firedAt)}`,
  ];
  const explain = state.firedAt === null ? state.note : [];

  return [...lines, ...explain.map((line) => `                ${line}`)].join('\n');
}

function stagedFiles() {
  const staged = spawnSync(
    'git',
    ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
    {
      cwd: projectRoot,
      encoding: 'utf8',
    },
  );

  return (staged.stdout ?? '').split('\n').filter(Boolean);
}

function newestStagedAt(files) {
  const times = files
    .map((file) => path.join(projectRoot, file))
    .filter((full) => existsSync(full))
    .map((full) => statSync(full).mtimeMs);

  return times.length === 0 ? null : Math.max(...times);
}

export function agentTierRan(states, files, now = Date.now()) {
  const newest = newestStagedAt(files);

  if (newest === null) return { ok: true, reason: 'nothing staged' };

  const latest = Math.max(...states.map((state) => state.firedAt ?? 0));

  if (latest === 0)
    return { ok: false, reason: 'no runtime has ever fired the per-edit hook' };
  if (latest < newest)
    return {
      ok: false,
      reason: 'the newest staged file is newer than the last hook run',
    };

  return { ok: true, reason: `last fired ${Math.round((now - latest) / 1000)}s ago` };
}

// SENSORS=git hands the sensors to a hook that may not be installed.
function commitGate() {
  const installed = existsSync(path.join(projectRoot, '.husky', 'pre-commit'));

  return `  Commit gate\n    .husky/pre-commit  ${mark(installed)}`;
}

// A hook whose script is missing fails silently: no events, no ledger, no error.
function registrations(dead) {
  const lines = dead.map((hook) => `    ${hook.manifest} names ${hook.script}  MISSING`);

  return ['  Registered hooks', ...(lines.length ? lines : ['    all resolve  ok'])].join(
    '\n',
  );
}

// A Stop hook killed mid-run reports nothing, and nothing records that it was killed.
function patience(tight) {
  const lines = tight.map((t) => `    ${t.manifest} allows ${t.seconds}s  TOO TIGHT`);

  return [
    `  Stop tier (needs over ${STOP_BUDGET / 1000}s)`,
    ...(lines.length ? lines : ['    both runtimes outlast it  ok']),
    `    last completed  ${when(lastSeen('stop'))}`,
  ].join('\n');
}

function reportOn(states) {
  const tight = tooTightToReport();
  const dead = deadHooks();
  const broken = states.filter((state) => !state.wired || !state.installed);
  const body = [
    ...states.map(describe),
    commitGate(),
    registrations(dead),
    patience(tight),
  ].join('\n\n');

  process.stdout.write(`SENSORS DOCTOR\n\n${body}\n\n`);
  process.exitCode = broken.length + dead.length + tight.length === 0 ? 0 : 1;
}

const REFUSAL = [
  '',
  '  SENSORS=agent tells the commit gate that the cheap sensors already ran',
  '  inside the agent loop. There is no evidence they did.',
  '',
  '  Run `npm run sensors:doctor` to see which runtime is wired, or unset',
  '  SENSORS so the commit gate runs them itself.',
  '',
].join('\n');

function assertOn(states) {
  const verdict = agentTierRan(states, stagedFiles());

  if (verdict.ok) return;

  process.stderr.write(`SENSORS DOCTOR: ${verdict.reason}.\n${REFUSAL}`);
  process.exitCode = 1;
}

// Importing this module must not run it.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const states = runtimes.map(examine);

  if (process.argv.includes('--assert')) assertOn(states);
  else reportOn(states);
}
