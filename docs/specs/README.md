# Specs

One spec per lesson. Work down the ledger: find the first row marked `Todo`, read its spec,
build it, make its acceptance test pass, then mark it `Done`.

| Lesson | Spec                                        | Status |
| ------ | ------------------------------------------- | ------ |
| 01     | [Single turn](lesson-01-single-turn.md)     | Done   |
| 02     | [Agent loop](lesson-02-agent-loop.md)       | Todo   |
| 03     | [Conversation](lesson-03-conversation.md)   | Todo   |
| 04     | [Read file](lesson-04-read-file.md)         | Todo   |
| 05     | [Observability](lesson-05-observability.md) | Todo   |
| 06     | Parallel calls                              | —      |
| 07     | Tool call loop                              | —      |
| 08     | Edit file                                   | —      |
| 09     | Bash                                        | —      |
| 10     | Coding system prompt                        | —      |

Lesson 01 arrives already built, so you have a working agent to change on your very first
step. A row marked `—` has no spec written yet.

## Status

- `Todo` — not started
- `WIP` — in progress
- `Done` — complete, and its acceptance test passes

## Spec structure

Each spec is short and the same shape:

```md
# Title without the lesson number

One sentence describing the goal.

## Key concept

One short paragraph naming the idea this lesson teaches.

## Requirements

Observable behavior only, including inherited behavior when it matters.

## Example

A runnable manual check: the prompt, and what you should see.

## Acceptance test

The command that proves it.

## Pressure test

A concrete scenario exposing the weakness that motivates the next lesson.
```

The `Pressure test` is the point of the whole sequence: each lesson ends by showing you what
it still cannot do, which is what the next lesson fixes.
