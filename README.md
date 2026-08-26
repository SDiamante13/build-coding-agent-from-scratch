# Build a Coding Agent from Scratch

You use AI agents every day. Under the hood, every one of them is a while loop, a language
model, and some tools. Over ten short lessons you will build one — no frameworks — until it
can read your code, change it, run your tests, and drive a kata test-first.

## Setup

Node.js 22 or newer, and git.

```sh
npm install
cp .env.example .env
```

`.env` is gitignored, so your key stays on your machine. Open it and paste in a key from
[openrouter.ai/keys](https://openrouter.ai/keys):

```sh
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=minimax/minimax-m3:free
```

That is the whole setup. `npm start` reads `.env` for you.

### Choosing a model

The default costs nothing, so you can build the whole agent without spending anything. Free
models are rate limited, though, so if replies start failing put a few dollars of credit on
your OpenRouter account and switch to `google/gemma-4-31b-it` — it is the fastest of the four
and a whole workshop costs cents. Any model that supports tool calling works; swap
`OPENROUTER_MODEL` and nothing else changes.

| Model                     | Tools | Context | Cost per 1M in/out | Notes                                     |
| ------------------------- | ----- | ------- | ------------------ | ----------------------------------------- |
| `minimax/minimax-m3:free` | yes   | 1M      | free               | the default — costs nothing, rate limited |
| `google/gemma-4-31b-it`   | yes   | 256K    | $0.10 / $0.34      | the fastest, and cheap enough to not care |
| `google/gemini-3.7-flash` | yes   | 1M      | $0.38 / $1.88      | a good all-rounder                        |
| `openai/gpt-5.6-luna`     | yes   | 1M      | $0.20 / $1.20      | strongest once the agent runs many tools  |

Prices and context limits for every model are at
[openrouter.ai/models](https://openrouter.ai/models?order=coding-high-to-low).

## The lessons

The four screens used in the session — the agentic loop, tool calling, this lesson map, and how
coach mode works — are in [`docs/index.html`](docs/index.html). Open it in a browser and use
the arrow keys.

Each lesson adds one capability, then runs into the wall that motivates the next one. That
wall is the point: you feel the limitation before you hear the fix.

| #   | Lesson                 | What you add                                   | What still hurts                                    |
| --- | ---------------------- | ---------------------------------------------- | --------------------------------------------------- |
| 1   | `single-turn`          | one API call, print the reply, exit            | you cannot ask a follow-up                          |
| 2   | `agent-loop`           | the loop — prompt, reply, repeat               | it forgets everything you just said                 |
| 3   | `conversation`         | keep the messages and resend them              | it cannot see your code                             |
| 4   | `read-file`            | a tool: schema, dispatch, tool result          | ask for two files and one is silently dropped       |
| 5   | `observability`        | a session log, and tool calls on screen        | now you can watch it drop the second one            |
| 6   | `parallel-calls`       | run every tool call in the message             | it reads, then stops — it cannot act on what it saw |
| 7   | `tool-call-loop`       | keep going until the model stops calling tools | it understands your code but cannot change it       |
| 8   | `edit-file`            | exact-match edits                              | it edits blind — it cannot run the tests            |
| 9   | `bash`                 | run commands, feed the output back             | powerful, but with no method                        |
| 10  | `coding-system-prompt` | the prompt that makes it work test-first       | nothing — point it at the kata                      |

**The finale:** point your agent at `kata/bowling` and ask it to build a bowling scorer
test-first. It writes the tests, makes them pass, and runs them itself.

## Get started

Open your coding agent in this directory and say **"coach me"**. It reads the ledger in
[`docs/specs`](docs/specs), finds the first lesson that is not done, and walks you through it
one small step at a time. If you would rather it wrote the code, say **"jfdi"**.

Run the agent you are building at any point:

```sh
npm start
```

From lesson 2 on it keeps asking until you stop it. Ctrl-C or Ctrl-D both quit cleanly.

Check your work against the lesson you are on:

```sh
npm test
```

## Falling behind

Every lesson has a tag on the `solution` branch. Your own work stays where it is:

```sh
git checkout lesson-4-read-file
```

Look at what changed between two of them to see a lesson in one screen:

```sh
git diff lesson-3-conversation lesson-4-read-file
```

## Repo map

- `docs/specs/` — the ledger and one spec per lesson
- `src/` — the agent you are growing. `index.ts` is the agent, `cli.ts` the terminal,
  `llm.ts` the model call. Lesson 1 is already here
- `test/` — an acceptance test per lesson, and the fake model they run against
- `docs/index.html` — the four screens used in the session
- `kata/bowling/` — the finale
- `sensors/` — authoring tooling for the maintainers. Not part of the workshop; ignore it.
