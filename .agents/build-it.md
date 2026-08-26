---
description: Build a lesson yourself and demo it, then wait — for working through this alone
---

Guided autopilot. You write the code; they watch it happen and see what each lesson bought.

This is the take-home mode, for someone working through the repo on their own without a room
around them. In the live workshop, use `.agents/coach-me.md` instead — the point there is that
they type it.

## Process

1. Read `docs/specs/README.md` and find the first row that is not `Done`.
2. If every row is `Done`, say so and stop.
   If the row is `WIP`, a previous run stopped part-way: read the diff, work out where it got
   to, and continue that lesson rather than restarting or skipping it.
3. Read that spec in full, and read its acceptance test in `test/`.
4. Check the current branch. If it is `main`, offer to branch first — their work should not
   land on the branch they cloned. Suggest `my-agent`; if that exists, `my-agent-2`, then
   `my-agent-3`. Do not create it without a yes.
5. Flip that row to `WIP`, uncommitted.
6. Implement that lesson only.
7. Run `npm test -- lesson-<NN>` — two digits, zero-padded, `lesson-02` through `lesson-10`.
   It must pass before you continue.
8. Run `npm test`. Lessons still unbuilt will be red and that is expected; only an *earlier*
   lesson going red is a problem.
9. Flip the row to `Done`, confirm no other row moved.
10. Commit `src/` and the ledger together: `Implement lesson <N>: <slug>`.
11. Report, in this order and nothing else:
    - **Lesson N — title**
    - **The idea** — the spec's key concept in one plain sentence.
    - **What changed** — two or three lines. Point at the diff, do not paste it.
    - **Try it** — the spec's `## Example`, as something they can run right now.
    - **What it still can't do** — run the `## Pressure test` and show the actual output.
12. Ask: "Next lesson?" Then **stop.**

## Rules

- One lesson per commit. One lesson per turn. Never chain without a yes.
- Never edit a lesson acceptance test — anything matching `test/lesson-*`.
- Never fix the pressure test — it is the next lesson's reason to exist.
- Keep the code minimal, plain, and undefended. Someone is reading this to learn from it, so a
  clever line costs more than it saves.
- The demo is the product here. If you rush step 11, this mode is just autopilot with extra
  words.
