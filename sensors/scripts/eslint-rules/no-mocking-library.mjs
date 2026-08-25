const MOCKING_OBJECTS = new Set(['vi', 'jest', 'sinon']);
const MOCKING_METHODS = /^(mock|doMock|spyOn|mocked|importMock|stub|createStubInstance)$/;

function isPlainMemberCall(callee) {
  return (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.object.type === 'Identifier'
  );
}

function mockingCallName(node) {
  const callee = node.callee;
  if (!isPlainMemberCall(callee)) return null;
  if (!MOCKING_OBJECTS.has(callee.object.name)) return null;
  if (!MOCKING_METHODS.test(callee.property.name)) return null;

  return `${callee.object.name}.${callee.property.name}`;
}

export const noMockingLibrary = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Hand-rolled fakes only. Mocking hides a design problem.' },
    schema: [],
    messages: {
      mocking: '{{call}} mocks a collaborator. Write a Fake in test/fakes/ instead.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const call = mockingCallName(node);
        if (call) context.report({ node, messageId: 'mocking', data: { call } });
      },
    };
  },
};
