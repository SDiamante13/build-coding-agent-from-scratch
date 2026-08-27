---
description: Check the human is ready to build, before lesson 1 costs them time
---

Verify this machine can actually run the workshop. Do it before the first lesson, not during
it — every one of these failures otherwise surfaces mid-lesson as something that looks like a
bug in their code.

Run the checks yourself. Report a short pass/fail list at the end, nothing more. If everything
passes, say so in one line and move on.

## 1 · Node and git

```sh
node -v && git --version
```

Node must be **22 or newer**. If it is older, say so and stop — nothing downstream will work,
and `npm install` may appear to succeed anyway.

## 2 · Dependencies

```sh
[ -d node_modules ] && echo installed || npm install
```

## 3 · A key

```sh
[ -f .env ] && grep -q '^OPENROUTER_API_KEY=sk-' .env && echo "key present" || echo "NO KEY"
```

If there is no `.env`, `cp .env.example .env`. If the key is missing or does not start with
`sk-`, send them to <https://openrouter.ai/keys> and stop. The default model is free and needs
no credit card.

Never print the key, never echo the file, and never put it in a commit.

## 4 · The model can call tools

This is the check that matters, and the one people skip. A model that chats fine can still be
unable to emit a `tool_call` — and that failure does not surface until lesson 4, silently, in
the middle of a lesson everyone else has finished.

So ping it with a tool and see whether it asks to use it:

```sh
set -a; . ./.env; set +a
curl -s https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$OPENROUTER_MODEL"'",
    "messages": [{"role":"user","content":"Read the file package.json"}],
    "tools": [{"type":"function","function":{
      "name":"read_file",
      "description":"Read a file from disk",
      "parameters":{"type":"object","properties":{"path":{"type":"string"}},"required":["path"]}
    }}]
  }' | head -c 2000
```

Read the response:

- `"finish_reason": "tool_calls"` with a `tool_calls` array — **pass.** This model carries all
  ten lessons.
- A normal text reply and `"finish_reason": "stop"` — the model will not call tools. Switch
  models before starting.
- HTTP 429, or a `rate limit` message — the free default is shared and gets hammered when a
  room full of people start at once. Switch models.
- `401` — the key is wrong or not yet active.

To switch, change one line in `.env`:

```sh
OPENROUTER_MODEL=openai/gpt-5.6-luna
```

A whole workshop costs cents, and it is the one that holds up best once the agent is running
many tools at once. Nothing else in the repo changes.

Do not switch to `google/gemini-3.7-flash`. It passes this check and then breaks in lesson 10;
the README says why.

## 5 · The starting line

```sh
npm test
```

Expect **lesson 1 passing and lessons 2 to 10 failing** — nine red suites. That is correct and
it is the point: lesson 1 ships already built so there is a working agent to change, and every
other lesson is a failing assertion waiting to become an instruction. They go green one at a
time. If lesson 1 fails, something above is wrong — go back.

## 6 · Their agent

Already proven: they are reading this because their coding agent found it. If it found this
file, it can find the lesson specs and the ledger.

## Record the pass

If every check passed, `touch .preflight-ok` (it is gitignored). That is how `coach me` knows
not to make them sit through this again when the session starts.

## Report

Six lines, one per check, `pass` or what to fix. Then either "You're ready — say **coach me**
to start lesson 2" or the single most important thing to fix first. Do not list every problem
at once; give them one thing to do.
