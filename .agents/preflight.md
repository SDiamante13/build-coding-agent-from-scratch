---
description: Check the human is ready to build, before lesson 1 costs them time
---

Verify this machine can actually run the workshop. Do it before the first lesson, not during
it — every one of these failures otherwise surfaces mid-lesson as something that looks like a
bug in their code.

Run the checks yourself. Report a short pass/fail list at the end, nothing more. If everything
passes, say so in one line and move on.

## 1 · The shell

```sh
node -p "process.platform"
```

- `darwin` or `linux` — carry on.
- `win32` — carry on, and note two things. Every command below is POSIX shell, so this has to be
  **Git Bash**, not PowerShell, which does not understand `&&`, `[ -d … ]` or `. ./.env`. And
  Node comes from the nodejs.org installer, not `nvm` — POSIX `nvm` does not run on Windows at
  all. Restart Git Bash after installing Node or it will still say `command not found`.

Do not send anyone to WSL2 to get past this step. Windows is the least rehearsed platform here,
so run the checks and let them say what is wrong.

## 2 · The environment

```sh
./setup --check
```

On Windows, `sh setup --check`. `--check` only reports what's missing — it never installs or
prompts, so you can run it without risking a hang waiting on input. It checks, in order: Node is
22, 24 or 26 — the only lines every lesson's tests have been run on; git; `node_modules`; an
OpenRouter key and a model in `.env`; that the shell is not exporting a different
`OPENROUTER_API_KEY` or `OPENROUTER_MODEL` over the top of `.env` (Node's `--env-file` never
overrides the shell, so the shell one silently wins); and the check that matters — whether the
model will actually emit a `tool_call`. A model that chats fine can still be unable to, and that
failure does not surface until lesson 4, silently, in the middle of a lesson everyone else has
finished.

It stops at the first failure and prints the fix. Most fixes are one command, `./setup` — it
installs dependencies and prompts for an OpenRouter key itself (hidden input, verified against
OpenRouter, written to `.env`). Run it in **their** terminal, not through a tool call — it waits
on typed input. Then run `./setup --check` again until it says "You're set up".

Never print the key, never echo `.env`, and never put it in a commit.

If it says the model answered with text instead of calling the tool, or that a provider is rate
limiting it, switch models. Change one line in `.env`:

```sh
OPENROUTER_MODEL=openai/gpt-5.6-luna
```

A whole workshop costs cents, and it is the one that holds up best once the agent is running
many tools at once. Nothing else in the repo changes. A `free-models-per-min` limit is different:
that is their own account's cap of 20 requests a minute across every free model, and waiting a
minute clears it.

Do not switch to `google/gemini-3.7-flash`. It passes this check and then breaks in lesson 10;
the README says why.

## 3 · The starting line

```sh
npm test
```

Expect **lesson 1 passing and lessons 2 to 10 failing** — nine red suites. That is correct and
it is the point: lesson 1 ships already built so there is a working agent to change, and every
other lesson is a failing assertion waiting to become an instruction. They go green one at a
time. If lesson 1 fails, something above is wrong — go back.

Lesson 1's test spawns the real agent with piped input and checks it exits `0`, which makes it
the only automated check of `src/cli.ts` in the repo. CI runs it on Windows, macOS and Linux on
every Node line `engines` admits, so a red lesson 1 with everything above green is something
about this machine, not a known bug — read the failure rather than reaching for WSL2.

## 4 · Their agent

Already proven: they are reading this because their coding agent found it. If it found this
file, it can find the lesson specs and the ledger.

## Record the pass

If every check passed, `touch .preflight-ok` (it is gitignored). That is how `coach me` knows
not to make them sit through this again when the session starts.

## Report

One line per check — the six `./setup --check` prints, the tests, their agent — `pass` or what to
fix. Then either "You're ready — say **coach me** to start lesson 2" or the single most
important thing to fix first. Do not list every problem at once; give them one thing to do.
