const DIRECTIVE =
  /^\s*(eslint|ts-|@ts-|prettier-|jscpd|#region|#endregion|globals|type\s)/;

function isNotProse(comment) {
  return comment.type === 'Shebang' || DIRECTIVE.test(comment.value);
}

function continues(previous, comment) {
  if (!previous || previous.end.type !== 'Line' || comment.type !== 'Line') return false;

  return previous.end.loc.end.line === comment.loc.start.line - 1;
}

function blocksOf(comments) {
  const blocks = [];

  for (const comment of comments) {
    if (continues(blocks.at(-1), comment)) blocks.at(-1).end = comment;
    else blocks.push({ start: comment, end: comment });
  }

  return blocks;
}

function heightOf(block) {
  return block.end.loc.end.line - block.start.loc.start.line + 1;
}

export const oneLineComment = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'A comment longer than one line is a document that cannot be linked to and will not be maintained.',
    },
    schema: [],
    messages: {
      longComment:
        'This comment is {{lines}} lines. Say the why in one line, or write it in context/ and point at it.',
    },
  },
  create(context) {
    return {
      Program() {
        const prose = context.sourceCode.getAllComments().filter((c) => !isNotProse(c));

        for (const block of blocksOf(prose)) {
          const lines = heightOf(block);

          if (lines > 1) {
            context.report({
              loc: block.start.loc,
              messageId: 'longComment',
              data: { lines },
            });
          }
        }
      },
    };
  },
};
