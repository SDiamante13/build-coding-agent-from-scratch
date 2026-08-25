import { testFunction } from './test-shape.mjs';

const CONDITIONALS = ['IfStatement', 'SwitchStatement', 'ConditionalExpression'];

export function insideTests(types, report) {
  let depth = 0;
  const visitors = types.map((type) => [
    type,
    (node) => {
      if (depth > 0) report(node);
    },
  ]);

  return {
    ...Object.fromEntries(visitors),
    CallExpression(node) {
      if (testFunction(node)) depth += 1;
    },
    'CallExpression:exit'(node) {
      if (testFunction(node)) depth -= 1;
    },
  };
}

export const noBranchingTest = {
  meta: {
    type: 'problem',
    docs: { description: 'A test with a branch is two tests, one of which never runs.' },
    schema: [],
    messages: {
      branching: 'This test branches, so it describes two behaviours and checks one.',
    },
  },
  create(context) {
    return insideTests(CONDITIONALS, (node) =>
      context.report({ node, messageId: 'branching' }),
    );
  },
};
