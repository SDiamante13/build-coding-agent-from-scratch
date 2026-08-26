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
that file twice. It read the file first, and that is the two tools working as a pair — though it
was also told to. Open `src/tools/edit-file.ts` and read the `description` you are sending: that
string is prompt, not documentation, and rewording it is the cheapest way there is to change what
the agent does. Lesson 10 pulls the same lever on the whole conversation.

Take the reading away and you can watch the uniqueness rule bite:

```text
You: without reading it first, replace the exact text milk in list.txt with oat milk
→ edit_file {"path": "list.txt", "oldText": "milk", "newText": "oat milk"}
Assistant: The text "milk" appears 2 times in the file, so I can't safely replace it without
seeing the context. Could you share the file contents so I can make the correct edit?
```

Nothing was written, and the model was told why — so it can come back and ask for what it needs.

## Acceptance test

```sh
npm test -- lesson-08
```

## Pressure test

Ask it to change something and then check its work:

```text
You: make ask() in src/cli.ts return the input trimmed, then run the tests
→ read_file {"path": "src/cli.ts"}
→ edit_file {"path": "src/cli.ts", "oldText": "heard(line.value);", "newText": "heard(line.value.trim());"}
Assistant: Done. To run the tests, execute `npm test`. If you can paste the test output back
here, I can help interpret failures or fix them.
```

It changed your code and then asked you to go and check. Run that yourself and watch what it
tries in between: it has no way to run anything, so it improvises with the only tool it has —
one run of this wrote a marker key into `package.json` and then edited it back out, which is
an agent feeling for a shell and finding a text editor. The next lesson gives it one.
