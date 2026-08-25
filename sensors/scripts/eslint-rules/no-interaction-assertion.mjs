const INTERACTION = /^toHaveBeen(Called|LastCalled|NthCalled)|^toHaveReturned/;

export const noInteractionAssertion = {
  meta: {
    type: 'problem',
    docs: { description: 'Assert what the code did, not which collaborator it rang.' },
    schema: [],
    messages: {
      interaction:
        '`{{matcher}}` asserts how the code worked, not what it did. Assert the outcome.',
    },
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (node.computed || node.property.type !== 'Identifier') return;
        if (!INTERACTION.test(node.property.name)) return;

        context.report({
          node: node.property,
          messageId: 'interaction',
          data: { matcher: node.property.name },
        });
      },
    };
  },
};
