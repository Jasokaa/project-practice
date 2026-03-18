# Copilot / LLM Custom Instructions (repo policy)

Recommended path (GitHub Copilot): `.github/copilot-instructions.md`  
Goal: make outputs deterministic, safe, and reviewable.

> GitHub Copilot supports custom instructions and prompt files; treat these as version-controlled “rules” for the assistant. citeturn0search2

## Non-negotiables
- **Never guess**: if info is missing, ask for the missing input or propose two options with explicit assumptions.
- **Small, reviewable diffs**: prefer minimal changes over rewrites.
- **No silent behavior**: explain *why* a change is needed and what risk it mitigates.
- **Prefer existing patterns**: follow established project architecture, naming, and folder conventions.
- **Tests required**: any non-trivial change includes tests or a concrete test plan.
- **Security baseline**: validate inputs, avoid unsafe deserialization, avoid shell injection, avoid secret leakage.

## Output format rules (for code tasks)
- If asked to implement: output **(1) plan**, **(2) patch/diff**, **(3) tests**, **(4) verification commands**.
- Use unified diffs when possible (or “file: content” blocks if diffs are unsupported).
- If you cannot run code: state it explicitly and give a deterministic local verification checklist.

## Context loading rules
When you start a task:
1. Read `memory/VISION.md`
2. Read `memory/CONSTRAINTS.md`
3. Read `memory/LESSONS.md`
4. Read `memory/ARCHITECTURE.md` (if present)
Then proceed.

## Decision framework
- Default to: **Spec -> Plan -> Implement -> Verify -> Document**
- Use “stop conditions”:
  - Missing requirements, unclear acceptance criteria, or ambiguous behavior -> stop and ask.
  - Risky changes (auth, payment, crypto, data loss) -> stop and request explicit confirmation.

## Code quality gates
- Type checks / linting / formatting are required if configured in the repo
- 0 new warnings in CI
- No TODOs without an issue reference

## Token discipline
- Do not paste full files unless requested.
- Prefer referencing filenames + line ranges.
- Summarize context in <= 10 bullet points before writing code.
