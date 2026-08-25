const SUPPRESSIONS = [
  { pattern: /\bStryker\s+disable\b/i, sensor: 'the mutation sensor' },
  { pattern: /\bjscpd:ignore\b/i, sensor: 'the duplication sensor' },
  { pattern: /\bgitleaks:allow\b/i, sensor: 'the secret sensor' },
];

function silences(comment) {
  return SUPPRESSIONS.find((suppression) => suppression.pattern.test(comment.value));
}

export const noSensorSuppression = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      suppressed:
        'This comment switches off {{sensor}} for code the sensor was written to watch.',
    },
  },
  create(context) {
    return {
      Program() {
        context.sourceCode
          .getAllComments()
          .map((comment) => ({ comment, found: silences(comment) }))
          .filter((entry) => entry.found)
          .forEach((entry) =>
            context.report({
              node: entry.comment,
              messageId: 'suppressed',
              data: { sensor: entry.found.sensor },
            }),
          );
      },
    };
  },
};
