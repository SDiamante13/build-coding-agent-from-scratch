export const structural = {
  'long-function': [
    'Long Method. The line count is the symptom; the cause is that this function holds several jobs at once.',
    'Start cheap. Extract Variable on the expressions you read twice, and rename the locals until each says what it holds — the seams surface once the names are honest, and both moves are safe.',
    'Then Extract Function per job, named for the job rather than its position. In a verb or kind dispatch chain each branch is already a function waiting for a name. Keep I/O at the outer shell so what you pull out stays pure.',
    'Not this: cutting the body at the line limit, or extracting a second half named for where it sat.',
  ],
  'long-file': [
    'First decide which kind of big this is, because the two have opposite fixes.',
    'If the file repeats one shape over and over, the length is duplication in disguise. Replace the copies with data — one array or map, and derive the rest from it. Splitting it in half is the gaming move.',
    'If it genuinely holds more than one responsibility, find the seam by asking which exports move together when a requirement changes, then Extract Class along it and Move Function to carry the behaviour across.',
    'Not this: splitting mid-responsibility to duck the count. Two half-files that only work together are worse than one long file.',
  ],
  'high-complexity': [
    'Every branch is a path the reader has to hold, and a path your tests probably do not cover.',
    'Extract Variable on the repeated expressions first — the structure is much easier to see once each condition has a name. Then Decompose Conditional: name each condition and each branch body. Half the complexity is usually one decision expressed several ways.',
    'Now fit the shape: Replace Nested Conditional with Guard Clauses for validation, Consolidate Conditional Expression where several conditions share an outcome, Replace Conditional with Polymorphism or a lookup keyed by the decision when switching over a type code.',
    'Not this: raising the threshold, or compressing the branches into ternaries or && chains. The counter sees through both, and either way every path survives.',
  ],
  'deep-nesting': [
    'Every level of nesting is a condition carried down the page. Three deep, the happy path is the hardest line in the function to find.',
    'Replace Nested Conditional with Guard Clauses: invert each outer condition, return early on the failure, and let the success path run down the left margin.',
    'If the nesting is a loop wrapped around a conditional, Split Loop or Replace Loop with Pipeline — filter, then map — usually flattens it completely.',
    'Not this: moving the inner block into a helper that is itself three deep. The nesting moved, it did not go.',
  ],
  'too-many-statements': [
    'Long Method: this function narrates every step instead of naming any of them.',
    'Read it once and list its jobs. Every comment you would be tempted to write is a function name.',
    'Slide Statements to bring related lines together, then Extract Function per job, keeping the extracted pieces pure. Split Phase when it decides and then acts — the deciding half becomes testable, the acting half becomes short. What is left should read as the plan.',
    'Not this: fusing statements into fewer, denser lines. The statements survive and the readability does not.',
  ],
  'too-many-parameters': [
    'Long Parameter List, with Data Clumps underneath it: parameters that always travel together are a concept nobody has named.',
    'Find the clump that appears in more than one signature — a verb and its noun are one command; session flags belong to the session.',
    'Introduce Parameter Object per clump, give each the domain name, and let behaviour migrate onto it. Preserve Whole Object where you are passing three fields of something the callee could take whole. A boolean in the list is its own smell: Remove Flag Argument and split into two named functions.',
    'Not this: shovelling everything into one anonymous options bag. That is the same list with braces on.',
  ],
  'duplicated-code': [
    'Duplicate Code. Beck ranks removing it second only to passing the tests, because copies drift and the next change has to be found twice.',
    'Read both copies before touching either. What varies between them is the parameter you are looking for.',
    'Identical: Extract Function and call it from both sites. Differ by a value: Parameterize Function — two names for one function is the common case. Differ by a step: pass the step in. Same idea in two places: Move Function so it has one home.',
    'Not this: reordering or rewording a copy to slip under the detector. That is the same duplication, now harder to find. And do not unify two things that merely look alike — if they have different reasons to change, make them read differently.',
  ],
};
