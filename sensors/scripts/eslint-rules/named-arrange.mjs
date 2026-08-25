import { assertsHere, testFunction } from './test-shape.mjs';

const MOST_SETUP = 8;

function setupLength(body) {
  const first = body.body.findIndex(assertsHere);

  return first === -1 ? body.body.length : first;
}

export const namedArrange = {
  meta: {
    type: 'suggestion',
    docs: { description: 'A long arrange is a name nobody has written yet.' },
    schema: [],
    messages: {
      unnamed:
        '{{count}} statements before this test asserts anything. Name the setup instead.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const body = testFunction(node)?.body;

        if (!body || body.type !== 'BlockStatement') return;

        const count = setupLength(body);

        if (count > MOST_SETUP) {
          context.report({ node, messageId: 'unnamed', data: { count } });
        }
      },
    };
  },
};
