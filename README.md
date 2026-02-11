# The Agent Republic

> *Build the city. Govern the citizens. Ship the unicorns.*

A production-grade "City of Agents" platform — specialized AI agents organized into districts, each with clear mandates, authority boundaries, and escalation paths.

## Architecture

```
                     ┌──────────────────────────┐
                     │   CHANCELLOR (Orchestr.)  │
                     └────────────┬─────────────┘
            ┌────────────────────┼────────────────────┐
   ┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
   │  A: WORKSHOP    │ │  B: FOUNDRY     │ │  C: RESEARCH    │
   │  Apps+Websites  │ │  AI Models      │ │  Browse+Synth   │
   └─────────────────┘ └─────────────────┘ └─────────────────┘
   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
   │  D: AUTOMATION  │ │  E: QA+SAFETY   │ │  F: OPERATIONS  │
   │  Jarvis Agents  │ │  Evals+RedTeam  │ │  Monitoring     │
   └─────────────────┘ └─────────────────┘ └─────────────────┘
              ┌─────────────────────────────────────┐
              │  G: IDENTITY & PERMISSIONS (RBAC)    │
              └─────────────────────────────────────┘

  ══════════ SHARED: Event Bus │ Job Queue │ Artifacts │ Traces ══════════
```

## Quick Start

```bash
npm install
npm run lint          # TypeScript type-check
npm run smoke         # Foundation smoke tests
npm run validate-tools # Validate MCP tool registry
```

## Project Structure

```
agent-republic/
├── foundation/      # Core runtime (P/E/V loop, trace, retry, permissions)
├── tools/           # MCP tool contracts + adapters
├── agents/          # District citizens (workshop, foundry, research, etc.)
├── districts/       # Chancellor + district configs
├── evals/           # Golden tasks, rubrics, eval harness
├── traces/          # Local trace storage + viewer
├── deploy/          # Dockerfile, CI, canary, rollback
└── docs/            # Charter, constitution, runbooks
```

## Core Concepts

- **Agent** — Stateful run (Plan → Execute → Verify) with `run_id`, permissions, scratchpad
- **Tools (MCP)** — JSON-Schema-validated functions with contracts
- **Trace Pipeline** — Every run emits structured spans → JSONL → queryable
- **Constitution** — Enforceable rules: schema validation, least privilege, HITL gates
- **Skills** — Pre-authored procedures that eliminate hallucination

## Values

1. Determinism over cleverness
2. Verification before progression
3. Least privilege, always
4. Observability is not optional
5. Humans stay in the loop for irreversible actions

---

*Agent Republic v0.1.0 — Day 0–30 MVP*
