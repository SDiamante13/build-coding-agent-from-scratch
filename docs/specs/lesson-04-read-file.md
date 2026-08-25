# Read file

Give the agent a tool, so it can read a file instead of guessing what is in it.

## Key concept

A tool call is not the model running anything. You send a list of tools you are willing to
run; the model replies "call `read_file` with this path"; **you** run it and send the result
back as another message. That is two requests with your own code in between, and it is the
whole of tool calling.

## Requirements

- Keep everything lesson 03 does: the loop, the conversation, the labels.
- Send one tool with every request: `read_file`, taking a single string `path`.
- When a reply asks for a tool call, read that path and send the contents back as a `tool`
  message answering that call, then ask the model again.
- Keep the assistant's tool-call message in the conversation too — the model has to see what
  it asked for.
- Print the reply that comes back from the second request.
- One tool call per turn is enough for this lesson.
- `src/tools.ts` owns the tool: its schema, and running it. `src/llm.ts` owns the messages.
  `src/index.ts` gains the `if`, and nothing else.

## Example

Run `npm start` in this repo, then try:

```text
You: what does src/index.ts do?
Assistant: It reads a prompt, sends it to the model, prints the reply, and loops.
```

Two requests went out. The first came back asking for `read_file`, and you never saw it.

## Acceptance test

```sh
npm test -- lesson-04
```

## Pressure test

Ask for two files at once:

```text
You: compare src/cli.ts and src/llm.ts
Assistant: src/cli.ts handles the terminal. I could not see src/llm.ts.
```

The model asked for both files in one reply. You ran the first and threw the second away, and
nothing anywhere said so — not the agent, not the model, not an error. Before fixing that, the
next lesson makes it visible, because a bug you cannot see is a bug you cannot fix.
