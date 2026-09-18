# Build a Coding Agent from Scratch

**Slides and setup — [sdiamante13.github.io/build-coding-agent-from-scratch](https://sdiamante13.github.io/build-coding-agent-from-scratch/)**

You use AI agents every day. Under the hood, every one of them is a while loop, a language
model, and some tools. Over ten short lessons you will build one — no frameworks — until it
can read your code, change it, run your tests, and drive a kata test-first.

## Setup

Node.js 22, 24 or 26 — 24 LTS is the one to install — and git. Every lesson's tests have been
run on all three; `npm install` refuses anything else rather than letting it fail mid-lesson.

```sh
./setup
```

It installs dependencies, then prompts for a key from
[openrouter.ai/keys](https://openrouter.ai/keys) — hidden input, verified against OpenRouter,
and written to `.env`, which is gitignored so your key never leaves your machine. It finishes by
proving your model can actually call a tool, the failure that otherwise waits until lesson 4 to
surface.

That is the whole setup. `npm start` reads `.env` for you. To check it again later — before the
workshop, say — run:

```sh
./setup --check
```

It only reports what's missing, without installing or prompting, and stops at the first thing to
fix. On Windows, run either as `sh setup` (or `sh setup --check`) from Git Bash.

### Choosing a model

The default costs nothing, so you can build the whole agent without spending anything. Any model
that supports tool calling works; swap `OPENROUTER_MODEL` and nothing else changes.

| Model                                 | Tier   | Context | Cost per 1M in/out | Notes                                             |
| ------------------------------------- | ------ | ------- | ------------------ | ------------------------------------------------- |
| `nex-agi/nex-n2.5-pro:free`           | free   | 256K    | free               | the default — asked for a tool 5 runs in 5         |
| `dots-studio/dots-3-note-preview:free`| free   | 512K    | free               | the fastest free one, and a different provider     |
| `inception/mercury-2.5`               | cheap  | 260K    | $0.04 / $0.15      | a diffusion model — published throughput is ~470 tokens a second |
| `z-ai/glm-5.3-flash`                  | cheap  | 1M      | $0.09 / $0.30      | the highest agentic benchmark score here, and ~20 providers behind it |
| `z-ai/glm-4.7`                        | medium | 205K    | $0.40 / $1.75      | a step up in size when a free model starts arguing with you |
| `openai/gpt-5.6-luna`                 | best   | 1M      | $0.20 / $1.20      | **recommended once you add credit** — no known wall |

The two free models were measured on this repo. The four paid rows are published specs and
benchmark scores, apart from `gpt-5.6-luna`, which was measured in an earlier run:

- **`nex-n2.5-pro:free`** asked for a tool in 5 of 5 identical one-shot runs. Given
  "make `ask()` in `src/cli.ts` return the input trimmed" it read the file, made the one-line
  edit, ran `npm test` and `npm run typecheck`, checked its own diff, and reported the results
  those commands actually printed. 70 seconds.
- **`dots-3-note-preview:free`** also asked for a tool 5 times in 5, and finished the same
  exercise in 19 seconds — the quickest of everything tried. It reads before it edits.
- **`gpt-5.6-luna`** ran all ten lessons and the pressure tests. Nothing has gone wrong with it.

Two warnings worth more than the table:

- **The free tier is capped at 20 requests a minute, across every free model on your account.**
  One prompt in lesson 10 can spend a dozen of them, because every tool call is another request.
  If replies start failing on a free model, that cap is the first suspect. Adding credit lifts
  it, and is what the paid rows are for.
- **Do not use `google/gemini-3.7-flash`.** It passes every preflight check and then dies
  part-way through lesson 10 with `Corrupted thought signature.` Gemini 3.x attaches encrypted
  reasoning to its replies and wants it back byte-exact next request — a round trip this agent
  does not do and the lessons do not teach. The failure arrives after nine lessons of everything
  working.

Free models also come and go. `poolside/laguna-s-2.1:free` was in this table until it started
answering every request with an upstream 429, and `minimax/minimax-m3:free` was the default
until it was caught inventing a file's contents and reporting success. If the default is having
a bad day, take the other free row.

Prices and context limits for every model are at
[openrouter.ai/models](https://openrouter.ai/models?order=coding-high-to-low).

## The lessons

The five screens used in the session — getting set up, the agentic loop, tool calling, this
lesson map, and how coach mode works — are at
[sdiamante13.github.io/build-coding-agent-from-scratch](https://sdiamante13.github.io/build-coding-agent-from-scratch/), or in
[`docs/index.html`](docs/index.html) if you have already cloned. Use the arrow keys.

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

**The finale:** the rules are in [`kata/bowling/README.md`](kata/bowling/README.md). Start your
agent with `npm start` and give it this:

```text
Read kata/bowling/README.md and build the bowling scorer test-first.
Run `npm run kata` to check your work.
```

Nothing in that says how to work. That comes from the system prompt you wrote in lesson 10, and
this is where you find out whether it took. `npm run kata` runs that folder alone, so a
half-finished scorer never turns your lesson tests red. You are not expected to finish — three
rules green, written test-first, is the exercise working.

The folder holds one file, so your agent has to make the rest. Watch what it does, and watch for
the three ways it goes wrong: writing the code before the test, making a failing test pass by
editing the test, and saying it is done without running anything. When it does one of those, the
system prompt is the thing to change — not the code.

## Get started

Open your coding agent in this directory and say **"preflight"** — it runs `./setup --check` for
you, which checks Node, your key, and that your model can actually call tools, the failure that
otherwise waits until lesson 4 to surface.

Then say **"coach me"**. It reads the ledger in [`docs/specs`](docs/specs), finds the first
lesson that is not done, and walks you through it one small step at a time. If you would rather
it wrote the code, say **"jfdi"**.

Claude Code, Codex, Copilot CLI, Cursor and pi all work. Each reads
[`AGENTS.md`](AGENTS.md) on its own and follows it to [`.agents/`](.agents), so the session is
the same whichever you brought — no per-agent setup.

**Using Codex?** Start it with `codex --yolo`. Codex sandboxes a fresh clone as `read-only`,
and trusting the folder only gets you as far as `workspace-write` with the network still shut —
which blocks the loopback server the acceptance tests run on, so every lesson's test times out.
`--yolo` turns the sandbox off and the tests pass.

If you would rather keep the sandbox, trust the folder and add this to `~/.codex/config.toml`:

```toml
[sandbox_workspace_write]
network_access = true
```

A `.codex/config.toml` inside the repo does not work — Codex only reads the one in your home
directory.

Run the agent you are building at any point:

```sh
npm start
```

From lesson 2 on it keeps asking until you stop it. Ctrl-C or Ctrl-D both quit cleanly.

Check your work against the lesson you are on:

```sh
npm test
```

Lessons you have not built yet stay red — that is the ledger, not a problem. A fresh clone
starts with nine red suites and they go green one lesson at a time.

## Falling behind

Every lesson has a tag on the `solution` branch. Take the working version of the lesson you are
stuck on and keep going — the `-- src/` matters, it copies those files in and leaves the rest of
your work alone:

```sh
git checkout lesson-4-read-file -- src/
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
- `docs/index.html` — the five screens used in the session, published at the link above
- `kata/bowling/` — the finale. One README and nothing else; your agent writes the rest
- `scripts/set-key.ts` — the interactive key prompt `./setup` calls
- `sensors/` — authoring tooling for the maintainers. Not part of the workshop; ignore it.
