export const behavioral = {
  'mutation-suppressed': [
    'A comment in this file told the mutation runner to skip it, so these mutants were never tried and the tier cannot say anything about the tests that cover them.',
    'Remove the comment and answer the finding underneath it. If the mutant it was hiding is a false alarm — an equivalent mutant that no test could possibly kill — say so in the test, by asserting the behaviour that makes it equivalent.',
    'Not this: leaving the suppression because the sensor is now quiet. Quiet is what the comment buys; it is not what it means.',
  ],
  'untested-source': [
    'No test file imports this source at all, so there is nothing for mutation testing to measure. This is the coverage gap in its largest form: not a line the tests miss, a file they have never heard of.',
    'Write the first test through the public entry point — the smallest one that asserts a real value, not that the module loads. One honest assertion turns this into ordinary mutant findings you can work through.',
    'Not this: a test that imports the module and asserts nothing, which converts a file nobody tests into a file whose mutants all survive.',
  ],
  'sensor-suppression': [
    "This comment does not fix anything. It removes a sensor's ability to say so, silently, for everyone who reads the file afterwards.",
    'Whatever it silences is still true: a surviving mutant still means the assertion is missing, a duplicate is still a second copy, a credential is still in the file. Fix the cause the sensor named.',
    'Not this: switching a sensor off from inside the file it would have reported. If a rule genuinely does not apply here, that is a change to the config, where it can be seen and reviewed — and it needs explicit approval.',
  ],
  'cheap-tier-first': [
    'The millisecond sensors still have findings on the files this turn changed, so the expensive tier has not run. Its answer would be about code that is going to change again as soon as you fix these.',
    'Fix what is listed below, then the behavioral tier runs on its own at the end of the next turn.',
    'Not this: reaching for the expensive sensor first because its findings sound more interesting. Cheap, then expensive, is the whole shape of the loop.',
  ],
  'scope-too-large': [
    'This change is larger than the end-of-turn budget. Mutating all of it would take minutes, and a sensor that takes minutes at the end of every turn is a sensor that gets switched off.',
    'Run `npm run check` on the whole change when you are ready to commit it — the commit gate has the time this tier does not. If the change is large because it is several changes, that is the finding underneath this one.',
    'Not this: raising the threshold so the tier goes quiet. The cost is real, and the number is where it is because that is what fits in a pause.',
  ],
  'unreadable-scope': [
    'Something named a path as source that this tier cannot read as source — most often an extension with a suffix after it, such as a mutation range or a backup name.',
    'Name the file itself. A path the sensor cannot read is a path it did not check, and it will not report a pass over one.',
    'Not this: dropping the argument and letting the sensor work the scope out for itself. That hides which file you meant.',
  ],
  'broken-types': [
    'The compiler rejects this code. The tests can still be green while it does — vitest strips types rather than checking them, so a type error sails through a passing suite and surfaces at the build.',
    'Fix it where the type is wrong, not where the error is reported. An error at a call site is usually a signature one file away that no longer says what the function does.',
    'Not this: an `any`, a cast, or a `@ts-expect-error` to get past the gate. Each one moves the failure to somewhere with less information about it.',
  ],
  'mutation-unavailable': [
    'The mutation run did not finish, so nothing here has been checked for weak assertions. This is not a finding about your code.',
    'Read the output below for the cause — a crashed test runner, a sandbox that could not be built, a config that no longer parses. Fix that, then run `npm run behavior:sensor` again.',
    'Not this: treating a sensor that could not run as a sensor with nothing to say.',
  ],
  'broken-behavior': [
    'The tests are red. Nothing above this line means anything until they are green — a mutation score over a failing suite is noise, so this tier stops here.',
    'Read the assertion that failed before you touch the code. Either the behaviour regressed, in which case fix the code, or the behaviour changed on purpose, in which case the test is the specification you are updating and it deserves the same care as the change.',
    'Not this: skipping the test, deleting the assertion, or widening it until red turns green. Each one keeps the suite quiet and throws away the only thing that noticed.',
  ],
  'mutant-survived': [
    'A mutant survived: this expression was changed into something with different behaviour, the whole suite ran, and nothing failed. That is a finding about your tests, not your code — some test executes this line and does not care what it produces.',
    'Find the test that covers it and ask what it actually asserts. The usual causes are asserting that a call did not throw, asserting on a shape rather than a value, asserting a substring loose enough to survive the change, or an expectation written after the fact from the output the code happened to produce.',
    'Then assert the behaviour the mutant broke. For a comparison, assert the boundary value itself and one value past it — examples either side of the boundary leave a `<=` mutated to `<` alive, because both agree everywhere except on the boundary. Asserting the whole returned value kills the literal ones. If writing that assertion is awkward, the design is telling you the function returns more than one thing.',
    'Not this: deleting the line the mutant landed on, narrowing the mutator set, or adding a test that repeats an assertion you already have. The mutant is a question about what the code is for — answer it.',
  ],
  'mutant-uncovered': [
    'No test executes this line at all. Mutation testing could not even try, so this is a coverage gap standing in front of an assertion gap.',
    'Write the test that reaches it, and reach it through the public entry point rather than by exporting the private thing so a test can poke it. If the line is genuinely unreachable from outside, that is the finding — delete it, and git will remember.',
    'Not this: a smoke test that calls the function and asserts nothing. That converts a NoCoverage mutant into a Survived one and leaves you exactly as informed as you were.',
  ],
};
