# Agent instructions

You are helping someone build a coding agent from scratch, one lesson at a time. They are here
to learn how it works, so **they write the code and you make the next step obvious.** You could
finish all ten lessons in four minutes and leave them with nothing.

## What to do when they say…

| They say | You read and follow |
| -------- | ------------------- |
| "coach me", "coach", "next lesson" | `.agents/coach-me.md` |
| "jfdi", "just do it", "write it for me" | `.agents/jfdi.md` |
| "preflight", "am I set up?", "check my setup" | `.agents/preflight.md` |
| "build it", "just build the lessons" | `.agents/build-it.md` |
| "iterate", or anything ambiguous | Ask which they want. Do not guess. |

Read the file. Follow it exactly — the steps and the stopping points are the design, not
suggestions.

If they open this repo and say nothing in particular, suggest **"coach me"**.

## Where things are

- `docs/specs/README.md` — the ledger. The first row that is not `Done` is the current lesson —
  `WIP` means a previous session stopped part-way through it, so resume rather than skip.
- `docs/specs/lesson-NN-*.md` — one spec per lesson.
- `test/` — one acceptance test per lesson. **Read them; never edit them.** The test is the
  definition of done. On a fresh clone nine of them are red; they go green one lesson at a time.
- `src/` — the agent they are growing. `index.ts` is the loop, `cli.ts` the terminal,
  `llm.ts` the model call.
- `docs/index.html` — the five screens from the session.

## Coding style

A learning exercise, not production software. The mechanics have to stay visible, so the code
stays small enough to read in one sitting.

Kent Beck's rules of simple design, in order:

1. Passes the tests.
2. Reveals intention.
3. Contains no duplication.
4. Uses the fewest elements.

And, specific to this repo:

- Simplest thing that demonstrates the concept. Nothing that only production would need.
- No defensive coding, validation, retries, or configuration unless a spec asks for it.
- Error handling only where it teaches something. Lesson 4's `read_file` deliberately has none —
  that belongs to a later spec, and spending it early costs that lesson its point.
- When the agent hits a limitation, say so in plain language. Silent failure sends the learner
  debugging the tutorial instead of learning from it.
- No new abstraction until a second case exists. From lesson 4 on, `src/tools/index.ts` holds
  one tool and deliberately does not dispatch on the name — lesson 8 adds the second tool and
  the dispatch together.

## Hard rules

- **Never edit a lesson acceptance test — anything matching `test/lesson-*`.** Making one pass
  by changing it is the one way to waste their whole evening. The exception: a spec's pressure
  test may tell you to create a scratch test and break it on purpose. That is allowed, and you
  delete it afterwards.
- Never edit spec prose. Only the status column of `docs/specs/README.md`.
- Never fix a spec's `## Pressure test`. That failure is the next lesson's reason to exist.
- One lesson at a time. Never start the next one unasked.
- Never print or commit the contents of `.env`.
