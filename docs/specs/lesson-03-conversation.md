# Conversation

Send the whole conversation on every request, so the agent remembers what was already said.

## Key concept

The model is stateless. Every request starts from nothing, so memory is not something the
model has — it is something you send. Keep the messages of the session in an array, append
each prompt and each reply to it, and post the whole array every turn.

## Requirements

- Keep everything lesson 02 does: the loop, the key check, the model default, the labels.
- Record each prompt as a `user` message and each reply as an `assistant` message.
- Send every message so far, oldest first, on every request.
- Keep `src/index.ts` as it is. The conversation belongs in `src/llm.ts`, behind the same
  one-argument `complete` — the agent still asks, completes, and replies.

## Example

Run `npm start`, then try:

```text
You: My name is Steven.
Assistant: Nice to meet you, Steven.
You: What is my name?
Assistant: Your name is Steven.
```

The second request carries three messages: your first prompt, its reply, and your second
prompt.

## Acceptance test

```sh
npm test -- lesson-03
```

## Pressure test

Run `npm start` in this repo, then try:

```text
You: What does src/index.ts do?
Assistant: I do not have access to your files, but a file named index.ts usually...
```

It remembers the conversation and knows nothing else. Everything it says about your code is a
guess, because the only thing it can see is what you typed. It needs a way to reach out of the
conversation and fetch something — that is a tool, and the next lesson gives it one.
