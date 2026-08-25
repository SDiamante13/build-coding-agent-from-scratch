#!/usr/bin/env node
// Lesson tags are derived from commit subjects, so a rebase can never orphan one.
// "Implement lesson 2: agent loop" -> lesson-2-agent-loop
import { spawnSync } from 'node:child_process';

import { projectRoot } from './roots.mjs';

const SUBJECT = /^Implement lesson (\d+): (.+)$/;

function git(...args) {
  return spawnSync('git', args, { cwd: projectRoot, encoding: 'utf8' }).stdout.trim();
}

function slug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const lessons = git('log', '--reverse', '--format=%H\t%s', 'solution')
  .split('\n')
  .map((line) => line.split('\t'))
  .map(([sha, subject]) => ({ sha, match: SUBJECT.exec(subject ?? '') }))
  .filter(({ match }) => match)
  .map(({ sha, match }) => ({ sha, tag: `lesson-${match[1]}-${slug(match[2])}` }));

// A lesson that ships on main is "where you start", so its tag follows main's tip. Pinning it
// to the commit that wrote it would leak every later main commit into the next lesson's diff.
function onMain(sha) {
  return (
    spawnSync('git', ['merge-base', '--is-ancestor', sha, 'main'], { cwd: projectRoot })
      .status === 0
  );
}

const mainTip = git('rev-parse', 'main');

for (const { sha, tag } of lessons) {
  const target = onMain(sha) ? mainTip : sha;
  const before = git('rev-parse', tag);

  git('tag', '-f', tag, target);
  process.stdout.write(`${before === target ? '  ok' : 'MOVED'}  ${tag} -> ${target.slice(0, 7)}\n`);
}

const diverged = spawnSync('git', ['merge-base', '--is-ancestor', 'main', 'solution'], {
  cwd: projectRoot,
}).status !== 0;

if (diverged) process.stdout.write('DIVERGED: main is not an ancestor of solution\n');

// solution carries lesson commits and nothing else, so every tag diff is pure implementation.
const strays = git('log', '--format=%h %s', 'main..solution')
  .split('\n')
  .filter(Boolean)
  .filter((line) => !SUBJECT.test(line.slice(line.indexOf(' ') + 1)));

for (const stray of strays) {
  process.stdout.write(`STRAY on solution (belongs on main): ${stray}\n`);
}

const stale = git('tag', '--list', 'lesson-*')
  .split('\n')
  .filter(Boolean)
  .filter((tag) => !lessons.some((lesson) => lesson.tag === tag));

if (stale.length > 0) process.stdout.write(`STALE tags with no commit: ${stale.join(', ')}\n`);

const healthy = stale.length === 0 && !diverged && strays.length === 0;

// A rebase moves every lesson tag, and git refuses to move a published tag without --force.
if (process.argv.includes('--push') && healthy) {
  const names = lessons.map(({ tag }) => tag);
  const pushed = spawnSync('git', ['push', '--force', 'origin', ...names], {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  process.stdout.write(pushed.status === 0 ? `pushed ${names.length} tags\n` : pushed.stderr);
  process.exitCode = pushed.status === 0 ? 0 : 1;
} else {
  process.exitCode = healthy ? 0 : 1;
}
