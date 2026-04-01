# Agent Workflow (token discipline + reliable code)

Codex-style agents can run as a coding agent triggered from terminal/VS Code/GitHub runners (depending on your setup). citeturn0search15  
Use agents for mechanical work; keep main chat for decisions.

## Roles (lightweight “multi-agent” without extra chatter)
- **Planner**: produces spec + acceptance criteria + risk list
- **Implementer**: writes minimal diff + tests
- **Reviewer**: adversarial review (security/perf/edge cases)
- **Verifier**: runs checks (or gives deterministic checklist)

You can run these sequentially in the same chat by explicitly switching roles:
“Act as Planner. …” then “Act as Implementer. …”

## Default pipeline
1) Planner: write spec + acceptance criteria
2) Reviewer: attack spec, find missing cases
3) Implementer: patch + tests
4) Verifier: commands + expected outputs
5) Memory: update `memory/LESSONS.md` if any defect was discovered

## Token-saving techniques that work
- **Context diet**: only attach:
  - issue description
  - one entrypoint file
  - memory files
- **Diff-only edits**: require unified diffs; avoid full-file rewrites.
- **Line-range references**: “edit src/a.ts:20-60” instead of pasting the file.
- **Stop early on ambiguity**: ask questions before writing code.
- **Cache summaries**: maintain a `memory/ARCHITECTURE.md` instead of re-explaining modules.

## “No wasted tokens” prompt snippet
Use at the top of tasks:
- Do not repeat the problem statement.
- Produce only what is requested (plan, diff, tests, verification).
- If blocked, output only blocking questions.

## Reliability gates
- Always add:
  - one regression test
  - one negative case
  - one boundary case
- Prefer deterministic outputs:
  - explicit error codes/messages
  - stable ordering
- If concurrency exists: add idempotency + retry safety notes.
