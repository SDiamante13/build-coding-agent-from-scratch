import ts from 'typescript';

const DIRECTIVE =
  /^\s*(eslint|ts-|@ts-|prettier-|jscpd|#region|#endregion|\/|globals|type\s)/;

const STATEMENT_KINDS = new Set([
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.DoStatement,
  ts.SyntaxKind.ExportDeclaration,
  ts.SyntaxKind.ForInStatement,
  ts.SyntaxKind.ForOfStatement,
  ts.SyntaxKind.ForStatement,
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.IfStatement,
  ts.SyntaxKind.ImportDeclaration,
  ts.SyntaxKind.ReturnStatement,
  ts.SyntaxKind.SwitchStatement,
  ts.SyntaxKind.ThrowStatement,
  ts.SyntaxKind.TryStatement,
  ts.SyntaxKind.VariableStatement,
  ts.SyntaxKind.WhileStatement,
]);

const EXPRESSION_KINDS = new Set([
  ts.SyntaxKind.AwaitExpression,
  ts.SyntaxKind.BinaryExpression,
  ts.SyntaxKind.CallExpression,
  ts.SyntaxKind.NewExpression,
  ts.SyntaxKind.PostfixUnaryExpression,
]);

function isCode(statement) {
  if (STATEMENT_KINDS.has(statement.kind)) return true;
  if (statement.kind !== ts.SyntaxKind.ExpressionStatement) return false;

  return EXPRESSION_KINDS.has(statement.expression.kind);
}

function parses(text) {
  const source = ts.createSourceFile(
    'comment.ts',
    text,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );

  return source.parseDiagnostics?.length ? null : source;
}

function looksLikeCode(raw) {
  const text = raw.trim();
  if (text.length < 6 || DIRECTIVE.test(text)) return false;

  const source = parses(text);

  return source ? source.statements.some(isCode) : false;
}

export const noCommentedOutCode = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Commented-out code is dead code that version control already remembers.',
    },
    schema: [],
    messages: {
      commentedOutCode: 'This comment is commented-out code, not documentation.',
    },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (comment.type !== 'Shebang' && looksLikeCode(comment.value)) {
            context.report({ loc: comment.loc, messageId: 'commentedOutCode' });
          }
        }
      },
    };
  },
};
