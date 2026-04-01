# Project Memory System (Vision + Constraints + Lessons)

Goal: keep a small, version-controlled “brain” that every LLM reads first, so it repeats fewer mistakes.

This is not “training”. It is explicit context + policies that you maintain in-repo.

Recommended folder:
- `memory/`

Minimum files:
- `memory/VISION.md`
- `memory/CONSTRAINTS.md`
- `memory/ARCHITECTURE.md` (optional but recommended)
- `memory/LESSONS.md`
- `memory/DEFINITIONS.md` (domain language, glossary)
- `memory/TOOLS.md` (MCP toolsets + permissions)

## Rules
- Keep each file short. Target:
  - VISION <= 250 lines
  - CONSTRAINTS <= 200 lines
  - LESSONS <= 200 lines (archive older items quarterly)
- Every significant bug fix adds a LESSON (max 120 words).
- Every new subsystem adds an ARCHITECTURE note (diagrams allowed).

## File templates

### memory/VISION.md
- Product mission (2-5 sentences)
- Primary users and jobs-to-be-done
- What “success” looks like (metrics, UX goals)
- Principles (5-12 bullets)
- Non-goals (explicitly out-of-scope)
- Roadmap boundaries (next 1-2 quarters)

### memory/CONSTRAINTS.md
- Supported platforms, versions, environments
- Performance budgets (latency, memory)
- Security constraints (threat model summary)
- Compliance constraints (PII handling)
- Dependency rules (allowed/blocked libs)
- Coding standards (lint, format, error handling)
- Release process constraints

### memory/ARCHITECTURE.md
- High-level diagram (text OK)
- Core modules + responsibilities
- Data flow (requests, events, jobs)
- Integration points
- Error handling strategy
- Observability (logs/metrics/traces)
- “Where to add new code” guide

### memory/LESSONS.md
Use a strict format so entries stay actionable:

- **Lesson**: <one sentence>
- **Trigger**: <what caused it>
- **Detection**: <how to catch it early>
- **Fix pattern**: <what to do next time>
- **Checklist**: <one checkbox item>

Example:
- Lesson: Always validate pagination params at API boundary.
- Trigger: Negative limit crashed DB query builder.
- Detection: Add API contract tests for limit/offset.
- Fix pattern: Clamp and return 400 with error code.
- Checklist: [ ] API boundary validates all query params.

## How to force LLMs to use memory (prompt rule)
Add this to your instruction file (Copilot) and to your Codex “task wrapper”:
- “Read `memory/VISION.md`, `memory/CONSTRAINTS.md`, `memory/LESSONS.md` before proposing changes. If you did not read them, stop.”

GitHub provides “custom instructions” and reusable prompt files; use those to enforce consistent behavior. citeturn0search2

## Review workflow (prevents “memory drift”)
- Treat memory edits like code:
  - PR review
  - require references to incidents/issues
- Quarterly:
  - archive old LESSONS to `memory/archive/LESSONS-YYYYQn.md`
  - keep the top 30-60 most relevant lessons in the main file
