export const comments = {
  'long-comment': [
    'A comment that needs more than a line is a document, and this is the worst place to keep one. Nothing links to it, no sensor reads it, and it goes stale the first time somebody changes the code beside it without scrolling up.',
    'First ask whether the code can say it. Nine times in ten the comment is a name nobody wrote — Extract Function until the call reads as the sentence, Rename until the parameter says what it is, Introduce Parameter Object until the clump has a noun. Delete the comment and see whether anything is actually missing.',
    'What survives that is a **why**: a constraint from outside, an alternative rejected, a cost accepted on purpose. If it fits in one line, keep it. If it does not, write it in `context/` and leave a one-line comment pointing there — the doc can hold the reasoning, be linked to, and be found by someone who is not already reading this file.',
    'Not this: splitting the paragraph into several one-line comments. The sensor counts consecutive lines, and even if it did not, six one-liners in a row is the same document with worse formatting.',
  ],
  'stale-comment': [
    'This comment names something that is not here. Either the code moved and the comment did not, or the comment was always describing somewhere else — and a reader cannot tell which, so they have to distrust every other comment in the file too.',
    'Read the code first, then decide which one is wrong. If the name changed, the comment is stale: fix it or delete it. If the thing genuinely lives elsewhere, say where, or move the note to where it is true.',
    'This is the failure that makes people stop believing comments. Code that lies is caught by a test; prose that lies survives every other sensor in this repository and is read as fact.',
    'Not this: removing the backticks so the sensor stops seeing a code reference. The comment still claims something untrue, and now nothing checks it.',
  ],
  'commented-out-code': [
    'Dead Code wearing a comment. This is not documentation — it is a branch someone was afraid to delete, and every reader after you has to work out whether it still matters.',
    'Delete it. Git remembers it, and `git log -S` will find it faster than anyone will find it here.',
    'If you are keeping it because the live code is wrong, fix the live code. If you are keeping it as a worked example, it belongs in a test, where it runs and stays true.',
    'Not this: leaving it with a note explaining why it is still here. A comment about dead code is two problems.',
  ],
  'deferred-work': [
    'A decision deferred, with no owner and no date, in the one place nobody looks — code that already works.',
    'If it is small, do it now. If it is not small, it is a piece of work: put it where work is tracked, with enough context to be actionable.',
    'If the note is really a warning about a constraint or a trap, rewrite it as one. A comment saying **why** the code is shaped this way earns its place; a comment saying what somebody ought to do later does not.',
    'Not this: relabelling it to a word the sensor does not scan. The work does not move because the label did.',
  ],
};
