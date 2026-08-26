# Bowling kata

Your agent writes the tests and the code. You read the arrows.

## The prompt

Start it with `npm start` and give it this:

```text
Read kata/bowling/README.md and build the bowling scorer test-first.
Run `npm run kata` to check your work.
```

Nothing in there says how to work. That part comes from the system prompt you wrote in
lesson 10, and this is where you find out whether it took.

## The game

Ten frames. The game score is the sum of the ten frames. Each frame scores the pins it knocked
down, plus a bonus:

- **Open frame** — two rolls, fewer than ten pins. No bonus.
- **Spare** — ten pins in two rolls. Bonus: the next roll.
- **Strike** — ten pins on the first roll. **The frame ends there, so a strike frame is one
  roll, not two.** Bonus: the next two rolls.

The tenth frame earns extra balls after a spare or a strike, to a maximum of three. None of the
cases below exercise that, and you do not need it to pass them.

## What to build

`kata/bowling/game.ts`, exporting a `Game` with two methods:

- `roll(pins: number)` — called once per ball, with the number of pins it knocked down
- `score(): number` — the total for the game, called once after the last ball

## The order to build it in

One rule at a time, each one a failing test first.

| #   | Case         | Rolls                      | Score |
| --- | ------------ | -------------------------- | ----- |
| 1   | Gutter game  | twenty 0s                  | 0     |
| 2   | All ones     | twenty 1s                  | 20    |
| 3   | One spare    | 5, 5, 3, then seventeen 0s | 16    |
| 4   | One strike   | 10, 3, 4, then sixteen 0s  | 24    |
| 5   | Perfect game | twelve 10s                 | 300   |

**You are not expected to finish.** Three of these green, written test-first, in ten minutes is
the exercise working.

## Running it

```sh
npm run kata
```

That runs this folder and nothing else. `npm test` runs your agent's own acceptance tests and
does not look in here, so a half-finished scorer never turns your lesson tests red.

## Watch for these

This folder holds one file, this one. Everything else your agent needs, it has to make — and
`edit_file` reads a file before it changes it, so the first thing it tries will come back as
`ENOENT`. Watch what it does next. It has a shell; it does not know yet that it needs one.

Three more, all of which happened in rehearsal:

- **It writes the code first and the test after.** The test passes on the first run, which
  proves nothing at all about the test.
- **It makes a failing test pass by changing the test.** `toBe(300)` becomes `toBe(290)`. Every
  run is green and the scorer is wrong.
- **It says it is done without running anything.** Check the arrows, not the prose.

If your agent does one of these, the system prompt is the thing to change — not the code. Then
run it again. That loop is the point of the whole workshop.
