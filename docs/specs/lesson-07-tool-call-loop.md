# Tool call loop

Keep running tool calls until the model has an answer, instead of stopping after one round.

## Key concept

The model decides when it is finished, not you. Hand it the tool results and ask again; if it
asks for more tools, run those too, and keep going until a reply comes back with text instead
of calls. That inner loop is the difference between a chatbot that can read a file and an
agent that can work something out.

## Requirements

- Keep everything lesson 06 does.
- After running a reply's tool calls, ask the model again.
- If that reply also asks for tools, run them and ask again. Repeat.
- Stop when a reply carries no tool calls, and print its text.
- The outer loop — prompt, answer, prompt again — does not change.
- In `src/index.ts` the `if` from lesson 04 becomes a `while`. That is the whole lesson.

## Example

Run `npm start` in this repo, then try:

```text
You: read src/index.ts, then read the files it imports
→ read_file {"path":"src/index.ts"}
→ read_file {"path":"src/cli.ts"}
→ read_file {"path":"src/llm.ts"}
→ read_file {"path":"src/tools/index.ts"}
Assistant: index.ts is the loop; cli.ts the terminal, llm.ts the model call, tools/ the tools.
```

Three requests, two rounds of tools, and the agent worked out the second round for itself.

## Acceptance test

```sh
npm test -- lesson-07
```

## Pressure test

Ask it to change something:

```text
You: src/cli.ts prompts with "You: " — make it "you> " instead
→ read_file {"path":"src/cli.ts"}
Assistant: Change line 8 of src/cli.ts from terminal.setPrompt('You: ') to
terminal.setPrompt('you> '). Would you like me to explain the rest of the file?
```

It found the line, and then it told you to type. It has one tool, and that tool only reads.
Every change still goes through your hands, which means the agent is a very well-informed
observer of your code. The next lesson gives it a tool that writes.
