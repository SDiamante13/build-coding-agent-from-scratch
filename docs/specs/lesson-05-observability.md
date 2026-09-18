# Observability

Show what the agent is doing, and keep a transcript of it, so you can debug the loop instead
of guessing at it.

## Key concept

Everything interesting in an agent happens between the prompt and the reply, and by default
none of it is on screen. Two cheap things fix that: print each tool call as it happens, and
append the whole transcript to a file you can `tail -f` in another pane. The screen stays a
summary you can read while it scrolls; the file holds the evidence — what you sent, what came
back, and what broke.

## Requirements

- Keep everything lesson 04 does.
- Start a session log at `logs/session-<timestamp>.log`, one per run. `logs/` is already
  gitignored.
- Say where the log is before the first prompt.
- Print a line for every tool call, before running it, naming the tool and its arguments.
- Write the prompts, the replies and the tool-call lines to the log, in the order they happen.
- Log the tools you advertise once, at startup. They never change, and re-sending them to the
  log on every request buries everything that does.
- Log what each request adds to the conversation, and how many messages it now holds. Log the
  reply in full.
- Log what each tool answered with, not only that it was called.
- Indent everything under a headline, so an editor folds it and the headlines are what is left.
- When the model call fails, log the failure — its status code, its body and its stack — then
  let the agent die the way it did before. You are recording the crash, not surviving it.
- `src/log.ts` owns the file, and anything may write to it. `src/cli.ts` owns what reaches the
  screen, and is the only place that does both. `src/index.ts` does not change.
- If `src/cli.ts` still exports `close`, delete it — nothing has used it since lesson 01.

## Example

Run `npm start` in this repo, then try:

```text
Session log: logs/session-2026-08-27T18-04-11-233Z.log
You: what does src/index.ts do?
→ read_file {"path":"src/index.ts"}
Assistant: It reads a prompt, sends it to the model, prints the reply, and loops.
```

The arrow is the tool call you could not see in lesson 04. Now `tail -f` the log in another
pane, and the same exchange reads:

```text
[2026-08-27T18:04:11.698Z] loading tools
  [
    {
      "type": "function",
      "function": { "name": "read_file", ... }
    }
  ]
[2026-08-27T18:04:11.720Z] You: what does src/index.ts do?
[2026-08-27T18:04:11.721Z] --> request 1, messages: 1
  {
    "role": "user",
    "content": "what does src/index.ts do?"
  }
[2026-08-27T18:04:16.306Z] <-- reply 1 after 4585ms
  {
    "choices": [{ "finishReason": "tool_calls", ... }],
    "usage": { "promptTokens": 436, "completionTokens": 14, "cost": 0.0000724 }
  }
[2026-08-27T18:04:16.307Z] → read_file {"path":"src/index.ts"}
[2026-08-27T18:04:16.311Z] <-- read_file answered after 3ms
  import * as cli from './cli.js';
  ...
```

Every line there answers something the screen cannot: what the model was actually sent, why it
stopped, how long it took, what it cost. Only the headlines start at column zero, so
`grep -n '^\[' logs/session-*.log` gives you an index of the session with line numbers.

## Acceptance test

```sh
npm test -- lesson-05
```

## Pressure test

Ask for two files again, and this time watch the screen:

```text
You: compare src/cli.ts and src/llm.ts
→ read_file {"path":"src/cli.ts"}
BadRequestResponseError: Provider returned error
  "No tool output found for function call call_aCEI1sueCUdpFkzRYV6RZnEX."
```

Same crash as lesson 04, and now there is a line above it. One arrow, where the model asked for
two files — so the thing that went missing is on screen, named, before the thing that broke.

That is the whole of observability. The bug did not change; what changed is that you can now
read it off the screen instead of inferring it from a stack trace. The next lesson runs all of
them.
