# Parallel calls

Run every tool call in a reply, instead of the first one and no others.

## Key concept

One assistant message can carry several tool calls. They do not depend on each other — that is
why the model sent them together — so run them all, at the same time, and answer each one with
its own `tool` message. Every call needs a reply, or the next request is malformed.

## Requirements

- Keep everything lesson 05 does.
- Run every tool call in the reply, not just the first.
- Send one `tool` message per call, each carrying the id of the call it answers.
- Run the calls concurrently. Nothing in a reply waits on anything else in the same reply.
- Print a line for each call, as in lesson 05.
- `src/tools/index.ts` runs the list; the tool files themselves do not change. `src/index.ts`
  changes from one call to all of them, and nothing else.

## Example

Run `npm start` in this repo, then try:

```text
You: compare src/cli.ts and src/llm.ts
→ read_file {"path":"src/cli.ts"}
→ read_file {"path":"src/llm.ts"}
Assistant: cli.ts owns the terminal; llm.ts owns the model call.
```

Two arrows now, and lesson 04's silently dropped file is gone.

## Acceptance test

```sh
npm test -- lesson-06
```

## Pressure test

Ask for something it has to look at twice:

```text
You: read src/index.ts, then read the files it imports
→ read_file {"path":"src/index.ts"}
Assistant:
```

The reply is blank. The model read `index.ts`, saw the imports, and asked to read them — but
the agent had already spent its one round of tools, so it printed the empty text of a message
that was nothing but a tool call. It can look once. The next lesson lets it keep going until
it has an answer.
