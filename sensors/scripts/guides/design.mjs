export const design = {
  'boundary-violation': [
    'The dependency points the wrong way. In a hexagon the arrows run inward: adapters know about the domain, and the domain knows nothing about adapters.',
    'Name what the domain actually needs from the outside — the capability, not the tool. Not `readFileSync`, but "load a saved game".',
    'Declare that capability as an interface in `src/ports`, take it as a parameter, and let an adapter in `src/adapters` implement it with the real thing. The domain depends on the name; the adapter depends on the tool.',
    'Not this: hiding the import behind a helper, a dynamic import, or a re-export. The arrow still points outward, it just takes longer to see.',
  ],
  'impure-domain': [
    'The domain reached for the outside world directly. Everything it touches this way becomes impossible to test without the world attached.',
    'Ask what the value is *for*. Printing is an output port. Reading the environment is configuration handed in at the edge. Fetching is a repository port.',
    'Take the capability as a parameter, define its shape in `src/ports`, and let the adapter supply the real one while the test supplies a Fake.',
    'Not this: guarding it with a typeof check or wrapping it in a small local function. The dependency survives; you have only made it harder to find.',
  ],
  'nondeterministic-domain': [
    'The domain read a clock or rolled dice, so the same input no longer produces the same output.',
    'Behaviour you cannot pin is behaviour a test cannot protect — and an unpinned assertion is exactly what the behavioral sensor will later report as a surviving mutant.',
    'Time and randomness are inputs, not ambient facts. Take a Clock or Random port and pass it in; the test then supplies a fixed instant or a seeded sequence and the assertion becomes exact.',
    'Not this: capturing the value once at module load, or asserting within a tolerance. The nondeterminism is still in the domain, now with a wider target.',
  ],
  'mocking-library': [
    "Feathers' argument as a lint rule: hard-to-test code is badly designed code, so mocking pain is design feedback. A mocking library medicates the pain and throws the feedback away.",
    'Write a Fake by hand in `test/fakes/` that implements the port. If the Fake is awkward to write, the port is wrong — that is the finding, and it is worth more than the test you were about to write.',
    'A Fake you own reads plainly, is reused across tests, and breaks loudly when the interface changes. A mock knows the implementation, so it keeps passing after the implementation is wrong.',
    'Not this: reaching for the mocking library because the collaborator is hard to construct. Hard to construct is the same finding wearing a different hat.',
  ],
};
