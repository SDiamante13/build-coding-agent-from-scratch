# Edit file

Give the agent a second tool, so it can change a file instead of telling you what to type.

## Key concept

Adding a tool changes nothing about the loop — that is the point. The model is sent one more
schema, and your dispatch finally has to look at the name of the call it was handed. The round
trip, the results and the loop already work, and they work the same for a tool that writes as
for a tool that reads.

## Requirements

- Keep everything lesson 07 does.
- Send a second tool with every request: `edit_file`, taking `path`, `oldText` and `newText`.
- Replace `oldText` with `newText` in that file, and answer the call with what happened.
- `oldText` must appear exactly once. If it appears no times or several, change nothing and
  say so in the result — the model reads that and can come back with more surrounding text.
- Dispatch on the name of the call. One tool meant there was no choice to make; two means
  there is.
- If the model asks for a tool you do not have, answer saying so rather than crashing.
- `src/tools/edit-file.ts` owns the new tool — its schema, and what happens when it is called
  — exactly as `src/tools/read-file.ts` owns the old one. `src/tools/index.ts` gains the
  dispatch. `src/index.ts` does not change, and neither does `src/tools/read-file.ts`.

## Example

Run `npm start` in this repo, then ask for the change lesson 07 could only describe:

```text
You: src/cli.ts prompts with "You: " — make it "you> " instead
→ read_file {"path": "src/cli.ts"}
→ edit_file {"path": "src/cli.ts", "oldText": "terminal.setPrompt('You: ');", "newText": "terminal.setPrompt('you> ');"}
Assistant: Done. The prompt in `cli.ts` is now `you> ` instead of `You: `.
```

`git diff src/cli.ts` and you will see one changed line. Put it back.

Look at what it passed as `oldText`: the whole statement, not the bare `"You: "`, which is in
that file twice. Open `src/tools/edit-file.ts` and read the `description` you are sending: that
string is prompt, not documentation, and rewording it is the cheapest way there is to change what
the agent does. Lesson 10 pulls the same lever on the whole conversation.

Your run may not read first. A model that can guess the exact line from your sentence will send
`read_file` and `edit_file` in the *same* reply and never look at what came back — the edit still
lands, because the guess was right. Ask for a change to text you have not quoted and it has no
choice but to read first.

Take the reading away and you can watch the uniqueness rule bite:

```text
You: without reading it first, replace the exact text milk in list.txt with oat milk
→ edit_file {"path": "list.txt", "oldText": "milk", "newText": "oat milk"}
Assistant: The text "milk" appears 2 times in the file, so I can't safely replace it without
seeing the context. Could you share the file contents so I can make the correct edit?
```

Nothing was written, and the model was told why — so it can come back and ask for what it needs.

Expect it to ask for tools you never sent, too. Models are trained on transcripts from other
agents, so a model that wants a shell reaches for whatever that shell was called there —
`run_shell_command`, `list_dir`, `write_file`. Your `tools` array is a suggestion, not a
constraint: nothing stops the model naming a function you have never heard of. Watch what
happens next, because it is the point of the requirement above — it reads
`There is no tool called run_shell_command.`, and picks a tool you do have. An answer it can
read is a course correction. An exception is the end of the session.

## Acceptance test

```sh
npm test -- lesson-08
```

## Pressure test

Ask it for the one thing it has no tool for:

```text
You: run the tests in test/
→ read_file {"path": "package.json"}
→ read_file {"path": "test/lesson-01-single-turn.test.ts"}
Assistant: I can't execute commands. Run `npm test` yourself and paste the output, and I'll
interpret the failures.
```

It cannot run anything, so it improvises with the two tools it has — reading `package.json` to
find out what `npm test` *would* do, reading the tests to guess what they *would* say. One run
of this wrote a marker key into `package.json` and then edited it back out, which is an agent
feeling for a shell and finding a text editor.

It can read your code and change your code, and it cannot find out whether the change worked.
The next lesson gives it a shell.
