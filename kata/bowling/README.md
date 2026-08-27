# Bowling kata

Score a game of ten-pin bowling.

## The game

Ten frames. The game score is the sum of the ten frames. A frame scores the pins it knocked
down, plus a bonus:

- **Open frame** — two rolls, fewer than ten pins. No bonus.
- **Spare** — ten pins in two rolls. Bonus: the next roll.
- **Strike** — ten pins on the first roll. The frame ends there, so a strike frame is one roll,
  not two. Bonus: the next two rolls.

The tenth frame earns extra balls after a spare or a strike, to a maximum of three.

## What to build

A `Game` with two methods:

- `roll(pins)` — called each time the player rolls a ball, with the number of pins knocked down
- `score()` — called at the end of the game, and returns the total score

## Examples

| Rolls                      | Score |
| -------------------------- | ----- |
| twenty 0s                  | 0     |
| twenty 1s                  | 20    |
| 5, 5, 3, then seventeen 0s | 16    |
| 10, 3, 4, then sixteen 0s  | 24    |
| twelve 10s                 | 300   |
