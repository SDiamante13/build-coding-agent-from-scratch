---
description: Write the code yourself so a human who is behind can catch up
---

They said `jfdi`. Write the code. Do not ask again, do not re-explain, do not offer
alternatives — they are behind and every extra line you produce costs them more of the gap.

## How much to do

Read the room from where you are:

- **Mid-lesson**, with a step on the table — do **that step only**, then carry on coaching from
  the next one. This is the common case: they want to keep pace, not skip the lesson.
- **Between lessons**, nothing started — do the **whole current lesson**: implement it, pass its
  acceptance test, run the pressure test, flip the ledger, commit. Then stop.

If it is genuinely ambiguous, do the smaller thing. Getting ahead of someone is worse than
doing too little.

## After you write it

Show the diff and one line saying what it does. That is the whole report.

They are still learning here — they read the diff instead of typing it. So the code has to be
worth reading: the same small, plain, undefended code the lesson would have produced. Do not
take shortcuts you would have coached them out of, and do not "improve" on the lesson while
you are in there.

Then return to coaching at the next step, in the shape `.agents/coach-me.md` describes. Do not
keep going just because you have momentum.

## Rules

- Never `jfdi` past the end of the current lesson.
- Never touch a lesson acceptance test — anything matching `test/lesson-*`. Those are the specification.
- **Commit only when you finish a whole lesson** — that is `.agents/coach-me.md` step 18, with
  the gate and the pressure test done first. A single mid-lesson step gets no commit. Subject
  when you do commit: `Implement lesson <N>: <slug>`.
- No apology, no preamble, no "great question". Write the code.
