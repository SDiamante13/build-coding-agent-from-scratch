# Build a Coding Agent from Scratch

You use AI agents every day. Under the hood, every one of them is a while loop, a language
model, and some tools. Over ten short iterations you will build one — no frameworks — until it
can read your code, change it, run your tests, and drive a kata test-first.

## Setup

Node.js and git are assumed.

```sh
npm install
```

Get a key from [OpenRouter](https://openrouter.ai/) and put it in `.env`:

```sh
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=google/gemini-3.7-flash
```

### Choosing a model

Any model that supports tool calling will work. These three are known to behave:

| Model                     | Notes                          |
| ------------------------- | ------------------------------ |
| `google/gemini-3.7-flash` | fast and cheap; a good default |
| `openai/gpt-5.6-luna`     | strongest at multi-step work   |
| `z-ai/glm-5.2:free`       | free tier; slower              |

Prices and context limits for every model are at
[openrouter.ai/models](https://openrouter.ai/models?order=coding-high-to-low). Switch by
editing `OPENROUTER_MODEL` — nothing else changes.

## Get started

Open your coding agent in this directory and say **"coach me"**. It reads the ledger in
[`docs/specs`](docs/specs), finds the first iteration that is not done, and walks you through it
one small step at a time. If you would rather it wrote the code, say **"jfdi"**.

Run the agent you are building at any point:

```sh
npm start
```

Check your work against the iteration you are on:

```sh
npm test
```

## Falling behind

Every iteration has a tag on the `solution` branch. Your own work stays where it is:

```sh
git checkout lesson-4-read-file
```

Look at what changed between two of them to see an iteration in one screen:

```sh
git diff lesson-3-conversation lesson-4-read-file
```

## Repo map

- `docs/specs/` — the ledger and one spec per iteration
- `src/` — what you build; empty until iteration 1
- `test/` — an acceptance test per iteration, and the fake model they run against
- `kata/bowling/` — the finale
- `sensors/` — authoring tooling for the maintainers. Not part of the workshop; ignore it.
