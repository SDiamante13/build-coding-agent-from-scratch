---
description: Build a lesson yourself and demo it, then wait — for working through this alone
---

Guided autopilot. You write the code; they watch it happen and see what each lesson bought.

This is the take-home mode, for someone working through the repo on their own without a room
around them. In the live workshop, use `.agents/coach-me.md` instead — the point there is that
they type it.

## Process

1. Read `docs/specs/README.md` and find the first `Todo` row.
2. If nothing is `Todo`, say so and stop.
3. Read that spec in full, and read its acceptance test in `test/`.
4. Check the current branch. If it is `main`, offer to branch first — their work should not
   land on the branch they cloned. Suggest `my-agent`. Do not create it without a yes.
5. Flip that row to `WIP`, uncommitted.
6. Implement that lesson only.
7. Run `npm test -- lesson-0<N>`. It must pass before you continue.
8. Run `npm test` to confirm nothing earlier broke.
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
- Never edit `test/`.
- Never fix the pressure test — it is the next lesson's reason to exist.
- Keep the code minimal, plain, and undefended. Someone is reading this to learn from it, so a
  clever line costs more than it saves.
- The demo is the product here. If you rush step 11, this mode is just `iterate-fast` with
  extra words.
