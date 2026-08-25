export const types = {
  'untyped-value': [
    'any switches the checker off for this value and everything it touches, and the failure surfaces somewhere else entirely.',
    'If you know the shape, declare the interface — the fields you access are the fields it has. That is the fix nine times out of ten.',
    'If the value arrives from outside — parsed JSON, a file, a network reply — take unknown instead, then narrow with a type guard before it travels inward.',
    'Inside the domain, model it. If this is a room id, a verb or a score, Replace Primitive with Object and give it a type that cannot hold a wrong value.',
    'Not this: renaming any to unknown and casting straight back. Same hole, longer path to it.',
  ],
  'unsafe-value': [
    'An any upstream is leaking through this line. Fix the source, not this line.',
    'Find where the value enters — a parameter, a parse, an external call — and give that boundary a real type: declare the shape you actually use, or take unknown and narrow it with a type guard.',
    'Type the source and every downstream unsafe finding disappears at once.',
    'Not this: an as cast, a non-null assertion or as any at the point of use. That keeps the lie and relocates it.',
  ],
  'mixed-returns': [
    'Decide what this function answers, and answer it on every path.',
    'The branch that returns nothing is a case you have not modelled. Give it a real value — an unrecognised-command message, an empty result, an Introduce Special Case object — not silence. If the function is trying to be both a query and a command, Separate Query from Modifier.',
    'Not this: a bare return on the quiet path. The rule passes and every caller still has to guess what happened.',
  ],
  'missing-return-type': [
    'Write the type you intended, not the one the checker infers. Where the two differ, the difference is usually the bug.',
    'If the honest return type is a union of unrelated shapes, that is the real finding: Introduce Special Case, or split into two functions with two names. Annotating any or unknown silences the rule and leaves the contract missing.',
  ],
  'suppressed-finding': [
    'A suppression deletes the finding, not the defect, and it deletes it silently for everyone who reads this file later.',
    'Fix the type instead — nine times in ten the suppression is standing on an any or a bad cast a line above it. If the type genuinely cannot be expressed today, use ts-expect-error with a written reason so it fails loudly the day the cause is fixed.',
    'Adding a suppression to clear a sensor finding needs explicit approval. Ask; do not assume.',
  ],
  'floating-promise': [
    'An unawaited promise runs outside the flow you can see: its rejection misses your try/catch and its ordering is whatever the event loop decides.',
    'Await it, return it to a caller who will, or attach a rejection handler that says what to do with the failure. Voiding it is right only when you have genuinely decided that neither the result nor the failure matters, and then it deserves a line saying so.',
  ],
};
