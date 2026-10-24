# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Behavioral guidelines

### Think before coding

Do not assume silently. Before implementing:

- State relevant assumptions explicitly.
- If multiple interpretations are plausible, present the tradeoffs instead of
  choosing silently.
- If a simpler approach exists, say so and prefer it when it meets the request.
- If the requirement is unclear, stop, explain what is unclear, and ask before
  changing code.

For multi-step work, define a short plan with a verification step for each part:

1. Implement the requested change.
2. Verify the behavior with checks or a visual pass.
3. Review the diff for unrelated changes and regressions.

### Simplicity first

Write the least code that fully solves the problem. No speculative abstractions,
no premature generalization, no scaffolding for requirements that do not exist yet.

Before adding anything, check in this order:

1. Does this need to exist at all? (YAGNI — delete unused code rather than adding)
2. Does the codebase already have a helper, component, or pattern for this?
3. Can the platform or an existing dependency do it?
4. Can it be one line?

Concretely, do not:

- Create an interface, factory, or wrapper with a single implementation
- Add a config option, flag, or parameter that will never be varied
- Add a dependency when a few lines of existing code would do

Prefer deleting code over adding it. If two options are the same length, pick the
one that handles edge cases correctly.

### Surgical changes

Touch only what is necessary for the request. Match the existing style, and do
not refactor, reformat, or improve adjacent code that is not broken.

- Every changed line should trace directly to the request or to a bug caused by
  the change.
- Remove imports, variables, or functions made unused by your own changes.
- Leave unrelated dead code alone; mention it instead of deleting it.

### Reuse before writing

Search the repo first. Re-implementing something that already exists a few files
away is the most common mistake.

When code is duplicated in more than one place, keep exactly one definition and
import it.

### Comments

Default to no comments. Only write one when the code is genuinely surprising and a
reader would otherwise get it wrong. Do not narrate what the code does.

### Accessibility

Built-in UI work must stay accessible: keyboard-navigable controls, focus states,
contrast, and a `prefers-reduced-motion` fallback for any motion.

## Project-specific rules

### Subagent pipeline

Implementation stays with the main agent. Everything after it is delegated to
the project subagents in `.opencode/agents/`, each waiting for the previous
stage to report clean:

1. `verifier` — runs the project's checks (lint, format, tests, build) when
   defined; reports "no checks" when none exist.
2. `reviewer` — reviews the diff against the rules in this file.
3. `committer` — commits, one logical change per commit. It never pushes.
4. `readme-writer` — only when the change affects how the project is run or used.
5. `push` — only when the user explicitly asks for a push.

The main agent hands off and waits for the report. It may still run checks while
implementing, but the final verification, review, and commit belong to the
subagents.

This full chain is for the finished state of a task. A small change committed
mid-task goes straight to the `committer` (see below).

### Commit during the work

Do not wait for the whole task to finish before committing. As soon as a **small
change** is complete, call the `committer` subagent, let it commit, then
continue with the next piece of work.

- **Small change** — one logical, self-contained edit that leaves the tree
  clean (a fix, a rename, one component, one file). Commit it right away.
  The `committer` re-runs the checks itself before committing.
- **Big change** — a refactor or feature spanning many files, or one whose
  intermediate states do not pass the checks. Leave it uncommitted until the
  whole thing is done, then run the full pipeline
  (`verifier` → `reviewer` → `committer`) and hand it over as one logical
  change, or split into several if each part stands on its own.

### Never touch local artifacts

Never write to, delete, or clean up `.sentry-native/`, and never remove or
overwrite files outside the change scope. Never stage secrets, API keys,
`.env`, `.venv`, `node_modules`, build output, or database files.

### README

- **Never add a Contributing, Code of Conduct, License, or Support section to
  `README.md`.** Keep it to what is needed to run and use the project.

### Style

- Follow the conventions already in the file you are editing.
- When the project defines checks (lint/format/tests in `package.json`),
  run them before considering work done.
- Keep the existing comment style: short, lowercase-leaning, explaining _why_
  rather than _what_.

### Git commits

- Write commit messages in Conventional Commits format, matching the existing history.
- Use imperative mood for the subject line, under 72 characters.
- Explain the reason behind a change, not just what changed.
- **Never add a `Co-Authored-By` trailer.** No AI attribution of any kind in commit
  messages.

### Commit after every change

Commit each edit as soon as it is verified, so any step can be undone with
`git revert <sha>`.

- One logical change per commit. Never batch unrelated edits together.
- Stage only the files the change touched. Check `git status` first so nothing
  unrelated slips in.
- Never amend, force-push, or rewrite history unless directly instructed.
  Force-pushing rewrites commits that may already be pulled elsewhere.

### Pushing

- Agents push only via the `push` subagent, only when the user explicitly asks.
- Push the current branch to its upstream (`git push -u origin <branch>` the
  first time). Pushing to `main` is expected for this repo.
- Never force-push. If the remote rejected a push, report it instead of
  rewriting history.
