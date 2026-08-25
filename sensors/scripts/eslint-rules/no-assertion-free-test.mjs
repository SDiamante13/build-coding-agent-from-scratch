import { isAssertionCall, testFunction } from './test-shape.mjs';

export const noAssertionFreeTest = {
  meta: {
    type: 'problem',
    docs: { description: 'A test that asserts nothing passes for the wrong reason.' },
    schema: [],
    messages: {
      noAssertion:
        'This test asserts nothing. It passes as long as the code does not throw.',
    },
  },
  create(context) {
    const tests = [];

    function noticed(node) {
      if (tests.length > 0 && isAssertionCall(node)) tests.at(-1).asserted = true;
    }

    return {
      CallExpression(node) {
        if (testFunction(node)) tests.push({ node, asserted: false });
        noticed(node);
      },
      'CallExpression:exit'(node) {
        if (!testFunction(node)) return;

        const test = tests.pop();

        if (!test.asserted) context.report({ node, messageId: 'noAssertion' });
      },
    };
  },
};
