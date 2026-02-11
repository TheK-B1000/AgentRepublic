// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — JSON Schema Validator
// "Schema-validate at the edge. Never trust raw LLM output." — Article II
// ═══════════════════════════════════════════════════════════════════════════

import AjvModule from 'ajv';
import addFormatsModule from 'ajv-formats';
import type { ValidationResult, ValidationError, ToolContract } from './types.js';

// AJV v8 + ajv-formats: handle CJS default export under NodeNext
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AjvClass = (AjvModule as any).default ?? AjvModule;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addFormats = (addFormatsModule as any).default ?? addFormatsModule;

// ─── Schema Validator ────────────────────────────────────────────────────

export class SchemaValidator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly ajv: any;

    constructor() {
        this.ajv = new AjvClass({
            allErrors: true,
            strict: false,
            coerceTypes: false,
        });
        addFormats(this.ajv);
    }

    /**
     * Validate tool input arguments against the tool's input schema.
     */
    validateToolInput(contract: ToolContract, args: Record<string, unknown>): ValidationResult {
        return this._validate(contract.inputSchema, args, `${contract.name}.input`);
    }

    /**
     * Validate tool output against the tool's output schema.
     */
    validateToolOutput(contract: ToolContract, output: unknown): ValidationResult {
        if (!contract.outputSchema) {
            // No output schema defined — pass by default
            return { ok: true, errors: [] };
        }
        return this._validate(contract.outputSchema, output, `${contract.name}.output`);
    }

    /**
     * Validate arbitrary data against a JSON Schema.
     */
    validate(schema: Record<string, unknown>, data: unknown, label = 'data'): ValidationResult {
        return this._validate(schema, data, label);
    }

    // ─── Private ───────────────────────────────────────────────────────────

    private _validate(
        schema: Record<string, unknown>,
        data: unknown,
        label: string,
    ): ValidationResult {
        const schemaId = `schema_${label}_${Date.now()}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let validate: any;

        try {
            validate = this.ajv.compile({ ...schema, $id: schemaId });
        } catch (err) {
            return {
                ok: false,
                errors: [
                    {
                        path: '',
                        message: `Schema compilation failed for ${label}: ${(err as Error).message}`,
                        keyword: 'schema_error',
                    },
                ],
            };
        }

        const valid = validate(data);

        if (valid) {
            return { ok: true, errors: [] };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errors: ValidationError[] = (validate.errors ?? []).map((err: any) => ({
            path: err.instancePath || '/',
            message: err.message ?? 'Unknown validation error',
            keyword: err.keyword,
        }));

        // Clean up compiled schema to prevent memory leaks
        this.ajv.removeSchema(schemaId);

        return { ok: false, errors };
    }
}

/**
 * Format validation errors into a human-readable string for LLM feedback.
 */
export function formatValidationErrors(result: ValidationResult): string {
    if (result.ok) return 'Validation passed.';
    return result.errors
        .map((e) => `  - ${e.path}: ${e.message} (${e.keyword})`)
        .join('\n');
}
