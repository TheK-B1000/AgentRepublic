// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Tools Barrel Export
// ═══════════════════════════════════════════════════════════════════════════

// Registry
export {
    ToolRegistry,
    createDefaultRegistry,
    // Individual contracts (re-exported for direct access)
    openUrlContract,
    clickContract,
    typeContract,
    screenshotContract,
    extractTextContract,
    runCodeContract,
    readFileContract,
    writeFileContract,
    publishDeployContract,
} from './mcp-registry.js';

// Adapters
export { executeOpenUrl } from './open-url.js';
export type { OpenUrlInput, OpenUrlOutput } from './open-url.js';

export { executeClick } from './click.js';
export type { ClickInput, ClickOutput } from './click.js';

export { executeType } from './type.js';
export type { TypeInput, TypeOutput } from './type.js';

export { executeScreenshot } from './screenshot.js';
export type { ScreenshotInput, ScreenshotOutput } from './screenshot.js';

export { executeExtractText } from './extract-text.js';
export type { ExtractTextInput, ExtractTextOutput } from './extract-text.js';

export { executeRunCode } from './run-code.js';
export type { RunCodeInput, RunCodeOutput } from './run-code.js';

export { executeReadFile } from './read-file.js';
export type { ReadFileInput, ReadFileOutput } from './read-file.js';

export { executeWriteFile } from './write-file.js';
export type { WriteFileInput, WriteFileOutput } from './write-file.js';

export { executePublishDeploy } from './publish-deploy.js';
export type { PublishDeployInput, PublishDeployOutput } from './publish-deploy.js';
