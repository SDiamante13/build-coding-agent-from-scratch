import { insideTests } from './no-branching-test.mjs';

const LOOPS = [
  'ForStatement',
  'ForOfStatement',
  'ForInStatement',
  'WhileStatement',
  'DoWhileStatement',
];

export const noLoopingTest = {
  meta: {
    type: 'problem',
    docs: { description: 'A failure inside a loop cannot say which case failed.' },
    schema: [],
    messages: {
      looping: 'This test loops, so a failure cannot name the case. Use it.each.',
    },
  },
  create(context) {
    return insideTests(LOOPS, (node) => context.report({ node, messageId: 'looping' }));
  },
};
