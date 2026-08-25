const TEST_CALLS = new Set(['it', 'test']);
const HOOK_CALLS = new Set(['beforeEach', 'beforeAll', 'afterEach', 'afterAll']);

// `thenUserSees(...)` asserts as surely as `expect(...)` does.
const ASSERTION = /^(expect|assert|then|should|verify)/;

export function rootName(callee) {
  if (callee.type === 'Identifier') return callee.name;
  if (callee.type === 'MemberExpression') return rootName(callee.object);
  if (callee.type === 'CallExpression') return rootName(callee.callee);

  return null;
}

function lastArgumentFunction(node) {
  const last = node.arguments.at(-1);
  const shapes = new Set(['ArrowFunctionExpression', 'FunctionExpression']);

  return last && shapes.has(last.type) ? last : null;
}

export function testFunction(node) {
  return TEST_CALLS.has(rootName(node.callee)) ? lastArgumentFunction(node) : null;
}

export function hookFunction(node) {
  return HOOK_CALLS.has(rootName(node.callee)) ? lastArgumentFunction(node) : null;
}

export function isAssertionCall(node) {
  const name = rootName(node.callee);

  return Boolean(name) && ASSERTION.test(name);
}

function unwrap(expression) {
  return expression.type === 'AwaitExpression' ? expression.argument : expression;
}

export function assertsHere(statement) {
  if (statement.type !== 'ExpressionStatement') return false;

  const call = unwrap(statement.expression);

  return call.type === 'CallExpression' && isAssertionCall(call);
}
