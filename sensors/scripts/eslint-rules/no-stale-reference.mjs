import { existsSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');

const BACKTICKED = /`([^`\n]+)`/g;
const IDENTIFIER = /^[A-Za-z_$][\w$]*(\(\))?$/;
const CAMEL_OR_SNAKE = /[a-z][A-Z]|_/;
const PATHLIKE = /^[\w.@/-]+\/[\w.@/-]+$/;

function namesCode(token) {
  if (!IDENTIFIER.test(token)) return false;

  return token.endsWith('()') || CAMEL_OR_SNAKE.test(token);
}

function pathResolves(token, filename) {
  const beside = path.resolve(path.dirname(filename), token);

  return existsSync(beside) || existsSync(path.resolve(projectRoot, token));
}

function identifiersIn(sourceCode) {
  return new Set(
    sourceCode.ast.tokens
      .filter((token) => token.type === 'Identifier')
      .map((token) => token.value),
  );
}

function unresolved(token, known, filename) {
  if (PATHLIKE.test(token)) return pathResolves(token, filename) ? null : 'staleFile';
  if (!namesCode(token)) return null;

  return known.has(token.replace(/\(\)$/, '')) ? null : 'staleName';
}

function driftIn(comment, known, filename) {
  return [...comment.value.matchAll(BACKTICKED)]
    .map(([, raw]) => raw.trim())
    .map((token) => ({
      token,
      loc: comment.loc,
      messageId: unresolved(token, known, filename),
    }))
    .filter((finding) => finding.messageId);
}

export const noStaleReference = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'A comment naming code that is no longer here has already drifted from the code.',
    },
    schema: [],
    messages: {
      staleName:
        '`{{token}}` is not in this file. Either the comment outlived the code, or it belongs somewhere else.',
      staleFile: '`{{token}}` does not exist. The comment points at a file that is gone.',
    },
  },
  create(context) {
    const known = identifiersIn(context.sourceCode);
    const filename = context.filename;

    return {
      Program() {
        const findings = context.sourceCode
          .getAllComments()
          .flatMap((comment) => driftIn(comment, known, filename));

        for (const { loc, messageId, token } of findings) {
          context.report({ loc, messageId, data: { token } });
        }
      },
    };
  },
};
