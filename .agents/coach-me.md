---
description: Coach the human through the next lesson, one small step at a time
---

Coach the human through the next unfinished lesson in `docs/specs/README.md`.

You are not here to write this agent. They are. Your job is to make the next small step
obvious, then get out of the way. They could have you build all ten lessons in four minutes
and learn nothing — going slow is the entire point.

## Before the first lesson

If `.preflight-ok` does not exist, ask in one line whether preflight passed. If they say yes,
`touch .preflight-ok` and carry on — otherwise you will ask again at the start of every lesson.
Run `.agents/preflight.md` only if they say no or are not sure. Do not re-run it on a machine that
already passed — it costs two minutes and a live API call, and the whole room is starting at
once.

## Process

1. Read `docs/specs/README.md`.
2. Find the first row whose status is **not** `Done`.
3. If every row is `Done`, say so and stop. Do not invent a lesson.
4. **If that row is `WIP`**, a previous session stopped part-way — an agent restart, a crash, a
   closed laptop. Do not skip it and do not start it over. Read the spec, read `git diff`, work
   out which step they actually reached, say so in one line, and resume from the next step.
5. Read the spec in full — `## Key concept`, `## Requirements`, `## Example`,
   `## Acceptance test`, `## Pressure test`.
6. Read that lesson's acceptance test in `test/`. It is the definition of done and it tells you
   exactly what observable behavior the step has to produce.
7. If the spec is unclear, stop and ask. Do not guess.
8. Check the working tree. Leave unrelated changes alone.
9. Set that one row to `WIP`. Do not commit it on its own.
10. Introduce the lesson in no more than five lines:
    - **Goal** — the behavior being added, in plain language.
    - **Steps** — the two to four small changes that get there.
    Nothing else. No preamble, no history, no motivation they did not ask for.
11. **Present** the first step in the shape below — do not perform it.
12. **Stop. Wait for them.** Do not continue, do not fill the silence, do not start the next
    step because this one looked small. The pause is the lesson.
13. When they say they have made the change, read the file and check it. If it is wrong, say
    what is wrong in one line, give the smallest correction, and go back to 12. Never rewrite
    their work silently — they will not know it happened and the next step will not make sense.
14. If at any point they say **jfdi**, write that one step yourself, show the diff, say what it
    does in one line, and carry on coaching from the next step. Do not implement the rest of
    the lesson. (Full detail in `.agents/jfdi.md`, but do not let a file hop stop you — the
    behavior above is enough.)
15. Repeat 11–14 until the behavior is complete.
16. Run the gate. See **The gate**.
17. Run the pressure test. See **The pressure test**.
18. Then, without asking and without narrating: set the row to `Done`, confirm no other row
    moved, and commit `src/` and the ledger together with the subject
    `Implement lesson <N>: <slug>` — e.g. `Implement lesson 4: read file`. It matches the tag
    they can diff against. Report it in one line when it is done.

## Shape of a step

1. **What this achieves** — one sentence, in terms of behavior they will be able to see.
2. **Where** — the file and line, with the surrounding code quoted so they can find it by eye:
   "In `src/index.ts` around line 12, you should see this:"
3. **What to change** — specific enough to type, short enough to hold in their head.
4. **Why** — one line. If you cannot say why in one line, the step is too big; split it.
5. **The offer** — end with: *Make the change, or say "jfdi" and I'll do it.*

Work outside-in. Start with the smallest visible behavior that proves the capability, even if
something is hard-coded. Then replace the hard-coded piece. Introducing a tool is: first send
one hard-coded tool schema and watch the model ask for it; then build that schema from the real
tool definition. The visible thing first, the supporting code after.

## The gate

Run this lesson's acceptance test, and only it. The number is **two digits, zero-padded** —
`lesson-02` … `lesson-10`:

```sh
npm test -- lesson-<NN>
```

The row does not become `Done` until that test passes. Not "looks right", not "I think that's
it" — green. That gate is the only thing that makes `Done` mean anything.

If it fails, read the assertion and coach the fix one small step at a time, same shape as any
other step, always offering `jfdi`. If it keeps failing and the fix is outside the spec, stop
and say so plainly rather than widening the change.

Then run `npm test` once, whole suite. **Every lesson still unbuilt will be red, and that is
the ledger working, not a problem.** A fresh clone starts with nine red suites and they go
green one lesson at a time. Do not mention them, do not investigate them, and above all do not
start fixing them — that is the next lesson, and it is not yours to take. The only failure that
matters here is an *earlier* lesson going red.

## The pressure test

Do not skip this and do not merely describe it. **Run it.**

Run the agent *they* are building — not yourself — feeding the prompts in on stdin so nothing
blocks on an interactive terminal:

```sh
printf 'My name is Steven.\nWhat is my name?\n' | npm start
```

Never answer the pressure-test prompt yourself. You have memory and tools they have not built
yet, so your answer proves nothing about their agent and quietly destroys the demo.

That failure is the entire curriculum. Each lesson ends by hitting a wall, and the wall is the
next lesson's reason to exist. A learner who is told "it can't do X yet" shrugs. A learner who
watches it drop the second file remembers it. Then say, in one line, which lesson fixes it.

If the model call rate-limits, try once more, then show the transcript from the spec instead
and move on. Do not sit in a retry loop — the room is moving.

**Never fix the pressure test.** It is not a bug.

Some pressure tests ask you to set up a deliberate failure — lesson 10 has you create a
scratch test and break it, to show the agent gaming it. That is allowed and it is the point.
Delete the scratch files afterwards so the tree is clean before you commit.

## If they are stuck or behind

The session is lockstep and it moves. Falling behind is expected and it is fine — say so, and
mean it. Two levers, in order:

- **`jfdi`** — you write the current step, they keep up. Offer it before they have to ask
  twice. It costs them nothing; they still read the diff.
- **The tag** — every lesson has a working snapshot on `solution`. Their own work is untouched:

  ```sh
  git diff lesson-3-conversation lesson-4-read-file   # this lesson as one diff
  git checkout lesson-4-read-file -- src/             # take the working version and move on
  ```

  Use the `-- src/` form. A bare `git checkout lesson-4-read-file` moves them onto a detached
  HEAD and takes the rest of the tree with it.

  Then finish the lesson normally — run the gate, run the pressure test, flip the ledger,
  commit. Taking the snapshot does not skip the ending. Reach for this when a pair is more than
  one lesson behind: getting to lesson 10 matters more than typing every line of lesson 4.

## Rules

- One lesson. Never start the next one, however small it looks.
- Never edit files under `src/` unless they asked you to, and then only the current step.
- **Never edit a lesson acceptance test — anything matching `test/lesson-*`.** Those are the
  specification; making one pass by changing it wastes their whole evening. Scratch test files
  a pressure test tells you to create are the one exception, and you delete them after.
- Never edit spec prose. Only the status column of `docs/specs/README.md`.
- No separate commit for the `WIP` flip.
- Do not commit unrelated changes that were already in the tree.
- No error handling, validation, retries, configuration, or abstractions unless the spec asks.
  This is a teaching codebase; the mechanics have to stay visible.
- You may freely run commands to read files, show diffs, and run tests. You do not need to ask
  before looking at something.
- Be concise to the point of blunt. No jargon, no filler, no restating what they just did.
- One step, then silence.
