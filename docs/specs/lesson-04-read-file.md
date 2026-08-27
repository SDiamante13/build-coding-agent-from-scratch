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
- **Run only the first tool call.** A reply can carry several; handling more than one is
  lesson 06, and doing it here spends that lesson early.
- One file per tool: `src/tools/read-file.ts` owns this tool — the schema the model is sent,
  and what happens when it is called. `src/tools/index.ts` owns the plumbing every tool shares.
  Lessons 08 and 09 then add a file instead of growing one.
- Each tool parses its own arguments. The model sends them as a JSON string, so `run` takes
  that string and names the shape it expects — one `type Arguments` per tool file.
- Nothing outside `src/llm.ts` imports from the SDK. It speaks the provider's wire format and
  hands the rest of the program plain types of your own. Get this wrong and swapping models
  later means editing every file instead of one.
- `src/llm.ts` owns the messages. `src/index.ts` gains the `if`, and nothing else.

## Example

Run `npm start` in this repo, then try:

```text
You: read src/cli.ts and tell me what it does
Assistant: It reads a line from the terminal, prints the assistant's reply, and exits when
the input ends.
```

Two requests went out. The first came back asking for `read_file`, and you never saw it.

Ask about `src/index.ts` instead and the reply comes back empty. That is not a bug: `index.ts`
is a handful of imports, so the model reads it, decides it needs `cli.ts` too, and asks for a
second file — and one round of tools is all this lesson does. Lesson 07 is where that stops
happening.

## Acceptance test

```sh
npm test -- lesson-04
```

## Pressure test

Ask for two files at once:

```text
You: compare src/cli.ts and src/llm.ts
BadRequestResponseError: Provider returned error
  "No tool output found for function call call_aCEI1sueCUdpFkzRYV6RZnEX."
```

The model asked for both files in one reply. You ran the first, threw the second away, and the
next request went out with two calls and one answer — which no provider accepts. OpenAI says
what you see above; Google says `Please ensure that the number of function response parts is
equal to the number of function call parts`. Same rule, different wording: **every tool call
needs its own answer.**

Read the stack trace and you cannot tell which call was dropped, or that one was. The agent
printed nothing before it died. Lesson 06 fixes the bug — but the next lesson comes first,
because a crash with nothing on screen in front of it is a crash you debug by guessing.
