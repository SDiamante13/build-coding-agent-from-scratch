import { behavioral } from './guides/behavioral.mjs';
import { comments } from './guides/comments.mjs';
import { design } from './guides/design.mjs';
import { docs } from './guides/docs.mjs';
import { mechanical } from './guides/mechanical.mjs';
import { secrets } from './guides/secrets.mjs';
import { structural } from './guides/structural.mjs';
import { tests } from './guides/tests.mjs';
import { types } from './guides/types.mjs';

export const guides = Object.fromEntries(
  Object.entries({
    ...structural,
    ...behavioral,
    ...comments,
    ...design,
    ...docs,
    ...secrets,
    ...types,
    ...mechanical,
    ...tests,
  }).map(([name, lines]) => [name, lines.join('\n')]),
);

export const kernels = {
  'long-function': 'extract one function per job',
  'boundary-violation': 'point the arrow inward',
  'impure-domain': 'take a port, not the world',
  'nondeterministic-domain': 'pass the clock in',
  'mocking-library': 'hand-roll a Fake',
  'assertion-free-test': 'it passes because nothing threw',
  'mystery-guest': 'build it in the test, name the setup',
  'branching-test': 'one test per path',
  'looping-test': 'it.each, so the failure names the case',
  'unnamed-arrange': 'a long arrange is a missing name',
  'interaction-assertion': 'assert the outcome, not the call',
  'leaked-secret': 'rotate it first, then remove it',
  'stale-doc': 'fix the doc or build the thing',
  'broken-behavior': 'green before you measure anything',
  'broken-types': 'green tests are not green types',
  'scope-too-large': 'this one is for the commit gate',
  'unreadable-scope': 'a path it cannot read is a path it did not check',
  'mutation-suppressed': 'quiet is what the comment buys, not what it means',
  'untested-source': 'no test has heard of this file',
  'cheap-tier-first': 'the cheap sensors go first for a reason',
  'sensor-suppression': 'the finding underneath is still true',
  'mutation-unavailable': 'a sensor that could not run has not passed',
  'mutant-survived': 'assert the value, not the absence of a crash',
  'mutant-uncovered': 'no test reaches this line',
  'commented-out-code': 'delete it, git remembers',
  'long-comment': 'name it in code, or link the doc',
  'stale-comment': 'the code moved, the comment did not',
  'deferred-work': 'do it, or track it properly',
  'long-file': 'decide which kind of big it is',
  'high-complexity': 'name the conditions first',
  'deep-nesting': 'guard clauses, return early',
  'too-many-statements': 'separate deciding from doing',
  'too-many-parameters': 'name the clump, pass one object',
  'duplicated-code': 'find what varies, parameterise it',
  'untyped-value': 'declare the shape',
  'unsafe-value': 'fix the any at the source',
  'mixed-returns': 'answer on every path',
  'missing-return-type': 'write the contract you intended',
  'suppressed-finding': 'fix the cause, not the report',
  'floating-promise': 'await it or handle the failure',
  'unused-binding': 'delete it',
  'as-const': 'use as const',
  'default-export': 'export it by name',
  'import-order': 'run the fixer',
  'sensor-contract': 'fix the cause, never the rule',
};

const guideByRule = {
  'max-lines-per-function': 'long-function',
  'sensors/no-commented-out-code': 'commented-out-code',
  'sensors/one-line-comment': 'long-comment',
  'sensors/no-stale-reference': 'stale-comment',
  'sensors/no-mocking-library': 'mocking-library',
  'sensors/no-assertion-free-test': 'assertion-free-test',
  'sensors/no-mystery-guest': 'mystery-guest',
  'sensors/no-branching-test': 'branching-test',
  'sensors/no-looping-test': 'looping-test',
  'sensors/named-arrange': 'unnamed-arrange',
  'sensors/no-interaction-assertion': 'interaction-assertion',
  'sensors/no-sensor-suppression': 'sensor-suppression',
  'no-restricted-imports': 'boundary-violation',
  'no-restricted-globals': 'impure-domain',
  'no-restricted-syntax': 'nondeterministic-domain',
  'no-warning-comments': 'deferred-work',
  'no-unused-expressions': 'unused-binding',
  'no-void': 'unused-binding',
  'max-lines': 'long-file',
  complexity: 'high-complexity',
  'max-depth': 'deep-nesting',
  'max-statements': 'too-many-statements',
  'max-params': 'too-many-parameters',
  'consistent-return': 'mixed-returns',
  'import/order': 'import-order',
  'import/no-default-export': 'default-export',
  '@typescript-eslint/no-explicit-any': 'untyped-value',
  '@typescript-eslint/no-unsafe-argument': 'unsafe-value',
  '@typescript-eslint/no-unsafe-assignment': 'unsafe-value',
  '@typescript-eslint/no-unsafe-call': 'unsafe-value',
  '@typescript-eslint/no-unsafe-member-access': 'unsafe-value',
  '@typescript-eslint/no-unsafe-return': 'unsafe-value',
  '@typescript-eslint/no-unused-vars': 'unused-binding',
  '@typescript-eslint/explicit-function-return-type': 'missing-return-type',
  '@typescript-eslint/prefer-as-const': 'as-const',
  '@typescript-eslint/ban-ts-comment': 'suppressed-finding',
  '@typescript-eslint/no-floating-promises': 'floating-promise',
  '@typescript-eslint/no-misused-promises': 'floating-promise',
};

export function guideForRule(ruleId) {
  const name = guideByRule[ruleId] ?? 'sensor-contract';

  return { name, text: guides[name], kernel: kernels[name] };
}
