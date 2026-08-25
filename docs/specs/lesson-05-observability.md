# Observability

Show what the agent is doing, and keep a transcript of it, so you can debug the loop instead
of guessing at it.

## Key concept

Everything interesting in an agent happens between the prompt and the reply, and by default
none of it is on screen. Two cheap things fix that: print each tool call as it happens, and
append the whole transcript to a file you can `tail -f` in another pane.

## Requirements

- Keep everything lesson 04 does.
- Start a session log at `logs/session-<timestamp>.log`, one per run. `logs/` is already
  gitignored.
- Say where the log is before the first prompt.
- Print a line for every tool call, before running it, naming the tool and its arguments.
- Write the prompts, the replies and the tool-call lines to the log, in the order they happen.
- `src/log.ts` owns the file. `src/cli.ts` owns what reaches the screen, and is the only place
  that knows both. `src/index.ts` does not change.
- If `src/cli.ts` still exports `close`, delete it — nothing has used it since lesson 01.

## Example

Run `npm start` in this repo, then try:

```text
Session log: logs/session-2026-08-27T18-04-11-233Z.log
You: what does src/index.ts do?
→ read_file {"path":"src/index.ts"}
Assistant: It reads a prompt, sends it to the model, prints the reply, and loops.
```

The arrow is the tool call you could not see in lesson 04.

## Acceptance test

```sh
npm test -- lesson-05
```

## Pressure test

Ask for two files again, and this time watch the screen:

```text
You: compare src/cli.ts and src/llm.ts
→ read_file {"path":"src/cli.ts"}
Assistant: src/cli.ts handles the terminal. I could not see src/llm.ts.
```

One arrow. The model asked for two files in that reply and the agent ran the first one only —
lesson 04's bug, now in plain sight. The next lesson runs all of them.
