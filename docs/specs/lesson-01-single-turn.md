# Single turn

Ask for one prompt, send it to the model, print the reply, and exit.

This lesson is already built for you. Read the code in `src/index.ts` — it is the whole agent
so far, and every later lesson grows out of it.

## Key concept

There is no magic underneath a coding agent. One turn is one HTTP request: you send messages,
you get a message back. Everything else in this workshop is built on top of that single call.

## Requirements

- Run it with `npm start`.
- Read `OPENROUTER_API_KEY` from the environment, via `.env`.
- If the key is missing, print a short error and exit non-zero.
- Ask the user for one prompt, labelled `You:`.
- Use `OPENROUTER_MODEL`, or `z-ai/glm-5.2:free` if it is unset.
- Print the reply, labelled `Assistant:`.
- Exit after the reply.

## Example

Run `npm start`, then try:

```text
You: What is the capital of France?
Assistant: The capital of France is Paris.
```

One reply, then the program exits.

## Acceptance test

```sh
npm test -- lesson-01
```

## Pressure test

Run `npm start`, ask one question, then try to ask a second one.

You cannot. The program has already exited, so every question needs a fresh process — and a
fresh process means a fresh `npm start` for every single thing you want to say. That is why
the next lesson wraps this in a loop.
