# Prompt Pack (GSD-style) for Engineering in Copilot Chat + Codex agents

This file is a library of reusable prompts. Use them as-is, or convert them into Copilot “prompt files”.

Notes:
- Copilot supports reusable prompt files and best practices for prompting. citeturn0search2turn0search0
- MCP in VS Code supports prompts and resources in chat. citeturn0search8

---

## 0) Universal task wrapper (use for any agent)
**Prompt**
You are a software engineer working in this repository.
Read these context files first: `memory/VISION.md`, `memory/CONSTRAINTS.md`, `memory/LESSONS.md`, `memory/ARCHITECTURE.md` (if exists).

Task:
<describe task>

Constraints:
- Output a short plan (max 12 bullets).
- Implement as a minimal diff.
- Include tests or a deterministic test plan.
- If requirements are unclear, list exact questions and stop.

Deliverables:
1) Plan
2) Patch (unified diff)
3) Tests
4) Verification commands

---

## 1) GSD: Spec first, then code (scope control)
**Prompt**
Turn this idea into an implementable spec (no code yet).
Include:
- Problem statement
- Non-goals
- User stories / API surface
- Data model changes
- Error handling rules
- Security and privacy considerations
- Acceptance criteria (bulleted, testable)
- Rollout plan (feature flags, migrations)

Idea:
<idea>

---

## 2) Architecture alignment check (avoid “works locally, breaks system”)
**Prompt**
Given `memory/ARCHITECTURE.md` and the current codebase, propose 2-3 implementation options for:
<feature>

For each option:
- Impacted modules
- Pros/cons
- Risk (security, performance, DX)
- Migration path
Pick the best option and explain why, referencing existing patterns in the repo.

---

## 3) Debugging: reproduce -> narrow -> fix -> prevent regression
**Prompt**
We have a bug:
<symptom>

Provide:
1) Likely root causes ranked (with evidence you would look for)
2) Minimal reproduction steps
3) Instrumentation/logging you would add
4) The smallest code change to fix
5) A regression test to prevent recurrence
6) A note to append to `memory/LESSONS.md`

---

## 4) Code review prompt (high signal, low tokens)
**Prompt**
Review the changes in this diff:
<diff>

Checklist:
- Correctness vs spec
- Edge cases and error handling
- Security issues
- Performance regressions
- API compatibility
- Test adequacy
Return:
- 5-15 review comments (actionable)
- Must-fix vs nice-to-have
- Suggested additional tests

---

## 5) Test generation prompt (deterministic, targeted)
**Prompt**
Generate tests for:
<module/function>

Context:
- Testing framework: <jest/pytest/xunit/etc>
- Key behaviors: <bullets>

Rules:
- Prefer table-driven tests.
- Cover success + failure + boundary cases.
- Add one property-based / fuzz-ish test if the framework supports it.
Return only test code and any necessary fixtures/mocks.

---

## 6) Refactor prompt (no behavior change)
**Prompt**
Refactor <module> to improve:
- readability
- separation of concerns
- testability

Constraints:
- No behavior changes (prove by tests).
- Keep public APIs stable.
Return:
1) Refactor plan
2) Patch
3) Tests/verification

---

## 7) “Implement with guardrails” prompt (security + reliability)
**Prompt**
Implement:
<feature>

Guardrails:
- Validate all external inputs.
- Use structured logging.
- Fail closed for auth/permissions.
- Add metrics hooks if the project has metrics.
- Ensure idempotency if endpoints/jobs can be retried.
Return plan + diff + tests + verification.

---

## 8) Documentation prompt (keep docs aligned with code)
**Prompt**
Update documentation for:
<change>

Outputs:
- Updated README/API docs
- Example usage
- Migration notes
- Add/Update ADR if architecture changed

---

## 9) Token-saving “context digest” prompt
**Prompt**
Before we proceed, produce a <= 200-word digest of the relevant existing code and constraints for:
<task>

Rules:
- Do not quote large blocks.
- Reference files and symbols instead.
- End with a list of exactly 5 assumptions (if any).

---

## 10) “Lessons learned” capture prompt (memory write)
**Prompt**
Write a short entry for `memory/LESSONS.md` based on:
- What went wrong / what was learned
- How to detect it early next time
- The policy/rule we should follow
- A quick checklist item
Keep it <= 120 words and make it actionable.

Incident:
<describe incident>
