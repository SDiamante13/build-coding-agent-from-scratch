#!/usr/bin/env node
// Lesson tags are derived from commit subjects, so a rebase can never orphan one.
// "Implement iteration 2: agent loop" -> lesson-2-agent-loop
import { spawnSync } from 'node:child_process';

import { projectRoot } from './roots.mjs';

const SUBJECT = /^Implement iteration (\d+): (.+)$/;

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

for (const { sha, tag } of lessons) {
  const before = git('rev-parse', tag);

  git('tag', '-f', tag, sha);
  process.stdout.write(`${before === sha ? '  ok' : 'MOVED'}  ${tag} -> ${sha.slice(0, 7)}\n`);
}

const stale = git('tag', '--list', 'lesson-*')
  .split('\n')
  .filter(Boolean)
  .filter((tag) => !lessons.some((lesson) => lesson.tag === tag));

if (stale.length > 0) process.stdout.write(`STALE tags with no commit: ${stale.join(', ')}\n`);

process.exitCode = stale.length === 0 ? 0 : 1;
