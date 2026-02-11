# Agent Republic Constitution
## "A chatbot hopes. An agent verifies."

### Article I — Every Action Shall Be Traced
Every agent execution generates a time-ordered `run_id`. Every tool invocation, LLM call, and state transition is logged as a structured span or event to JSONL traces. Trace failures never crash the agent — they degrade gracefully to stderr.

### Article II — Tool Contracts Over Natural Language
Tool inputs and outputs are validated against JSON Schema before execution. Hallucinated tool names are rejected by the registry. Schema violations produce structured error feedback for the LLM to self-correct.

### Article III — Retry Is the Architecture
Transient failures (rate limits, timeouts, network errors) are retried with exponential backoff and jitter. Non-retryable errors (auth failures, validation errors) propagate immediately. Every retry is traced.

### Article IV — Least Privilege, Always
Each agent has a manifest declaring its allowed capabilities. Denied capabilities are explicitly listed. Cost budgets enforce financial limits. Human-in-the-loop actions require explicit approval.

### Article V — Plan → Execute → Verify
Every agent follows the deterministic P/E/V state machine:
1. **Plan**: LLM reasons about the goal, selects next tool
2. **Execute**: Tool runs with schema validation and retry
3. **Verify**: LLM checks the result against the goal
4. **Loop or terminate**: Re-plan if verification fails

Terminal states: `COMPLETE`, `FAILED`, `ESCALATED`

### Article VI — Districts Contain Blast Radius
Agents are organized into districts (Workshop, Foundry, Research, Automation, QA & Safety, Operations, Identity). Each district has its own tool allowlist, concurrency limits, and eval suites. A bug in one district cannot cascade to others.

### Article VII — Deployments Require Human Approval
The `publish_deploy` tool always requires explicit human approval. No agent can autonomously ship to production. Canary deployments are the default.

### Article VIII — The Chancellor Arbitrates
The Chancellor decomposes high-level goals into district-scoped tasks. It monitors runs across districts. When agents disagree, the Chancellor resolves.

### Article IX — Evaluation Is Continuous
Golden tasks define expected outcomes. Rubrics score agent outputs. Task Success Rate (TSR) is the primary metric. Every PR runs the eval suite.

### Article X — Agents Earn Trust, Autonomy Follows
New agents start with minimal trust — limited tools, low budgets, short limits. As evals pass consistently, permissions expand. Regression triggers automatic restriction.
