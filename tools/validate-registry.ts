// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Tool Registry Validator
// Validates all tool contracts are well-formed and schemas compile.
// Run: npx tsx tools/validate-registry.ts
// ═══════════════════════════════════════════════════════════════════════════

import { createDefaultRegistry } from './mcp-registry.js';
import { SchemaValidator } from '../foundation/schema-validator.js';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean): void {
    if (condition) {
        console.log(`  ${GREEN}✓${RESET} ${label}`);
        passed++;
    } else {
        console.log(`  ${RED}✗${RESET} ${label}`);
        failed++;
    }
}

function main(): void {
    console.log(`\n${BOLD}═══ Tool Registry Validation ═══${RESET}\n`);

    const registry = createDefaultRegistry();
    console.log(`${YELLOW}▸ Registry loaded: ${registry.size} tools${RESET}\n`);

    check('Registry has 9 tools', registry.size === 9);

    const validator = new SchemaValidator();
    const contracts = registry.listContracts();

    for (const contract of contracts) {
        // Each contract must have required fields
        check(`${contract.name}: has name`, contract.name.length > 0);
        check(`${contract.name}: has inputSchema`, contract.inputSchema != null);
        check(`${contract.name}: has sideEffects flag`, typeof contract.sideEffects === 'boolean');
        check(`${contract.name}: has idempotent flag`, typeof contract.idempotent === 'boolean');

        // Schema must compile
        try {
            const result = validator.validateToolInput(contract, {});
            // It's ok if it fails validation (required fields missing), but it must not crash
            check(`${contract.name}: schema compiles`, true);
        } catch (err) {
            check(`${contract.name}: schema compiles`, false);
        }
    }

    // Test inventory string
    const inventory = registry.toInventoryString();
    check('toInventoryString() non-empty', inventory.length > 0);
    check('toInventoryString() lists all tools', contracts.every((c) => inventory.includes(c.name)));

    // Test getOrThrow with invalid name
    try {
        registry.getOrThrow('hallucinated_tool_xyz');
        check('getOrThrow() rejects unknown tool', false);
    } catch {
        check('getOrThrow() rejects unknown tool', true);
    }

    // Summary
    console.log(`\n${BOLD}═══ Results ═══${RESET}`);
    console.log(`  ${GREEN}Passed: ${passed}${RESET}`);
    if (failed > 0) console.log(`  ${RED}Failed: ${failed}${RESET}`);
    else console.log(`  ${GREEN}Failed: 0${RESET}`);
    console.log();

    if (failed > 0) process.exit(1);
}

main();
