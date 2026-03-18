# MCP Playbook (Copilot Chat + external tools)

MCP (Model Context Protocol) extends Copilot by integrating external systems as tools, prompts, and resources. citeturn0search16  
VS Code supports adding/managing MCP servers and using MCP prompts/resources in chat. citeturn0search8  
GitHub docs describe extending Copilot Chat with MCP and toolsets. citeturn0search4

## What to use MCP for
- **Read-only context**: issues, PRs, docs, database schemas, API responses
- **Controlled actions**: creating issues/PRs, running safe queries, generating artifacts
- **Prompt routing**: standardized prompts packaged with a server (e.g., /server.promptName)

## Setup checklist (generic)
1. Pick MCP servers you trust and can sandbox.
2. Define a “toolset” per domain (repo, tickets, docs, database).
3. Define least-privilege credentials for tools that can mutate state.
4. Record each toolset in `memory/TOOLS.md`:
   - server name
   - capabilities
   - allowed actions
   - data sensitivity notes

## Usage patterns (low token, high reliability)
### Pattern A: “Add Context -> Execute”
- Add a single MCP resource (e.g., issue text or schema)
- Ask for a context digest (<= 200 words)
- Only then request a plan and diff

### Pattern B: “Agent does the chores”
- Use agent mode to:
  - gather context via MCP resources
  - generate a spec and acceptance criteria
  - draft tests
- Keep main chat for decisions and review.

### Pattern C: “Two-pass verification”
1) Agent proposes patch + tests  
2) Agent runs/validates (if tool allows) and reports:
   - commands executed
   - outputs summarized
   - failures + fixes

## Safety guardrails for MCP tools
- For any tool that writes (create PR, edit files, run commands):
  - require explicit “DO IT” confirmation text in prompt
  - require a dry-run preview first (diff, payload)
- Do not allow tools to access secrets unless necessary; prefer short-lived tokens.
- Log tool usage in `memory/TOOL-LOG.md` (date, toolset, action, purpose).

## Suggested minimal MCP resources to add to context
- `memory/VISION.md`
- `memory/CONSTRAINTS.md`
- `memory/LESSONS.md`
- Current issue/PR description
- One relevant code entrypoint file
