import { hookFunction, testFunction } from './test-shape.mjs';

function declaredNames(declaration) {
  return declaration.declarations
    .map((one) => one.id)
    .filter((id) => id.type === 'Identifier')
    .map((id) => id.name);
}

export const noMysteryGuest = {
  meta: {
    type: 'problem',
    docs: { description: 'A test you cannot read without scrolling up is not a test.' },
    schema: [],
    messages: {
      guest:
        '`{{name}}` is filled in by a hook, so this test cannot be read from its own body.',
    },
  },
  create(context) {
    const shared = new Set();
    let inHook = 0;
    let inTest = 0;

    return {
      VariableDeclaration(node) {
        if (node.kind === 'const' || inTest > 0 || inHook > 0) return;

        declaredNames(node).forEach((name) => shared.add(name));
      },
      AssignmentExpression(node) {
        if (inHook === 0 || node.left.type !== 'Identifier') return;
        if (!shared.has(node.left.name)) return;

        context.report({ node, messageId: 'guest', data: { name: node.left.name } });
      },
      CallExpression(node) {
        if (hookFunction(node)) inHook += 1;
        if (testFunction(node)) inTest += 1;
      },
      'CallExpression:exit'(node) {
        if (hookFunction(node)) inHook -= 1;
        if (testFunction(node)) inTest -= 1;
      },
    };
  },
};
