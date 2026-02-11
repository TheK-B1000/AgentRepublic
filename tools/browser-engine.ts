// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Browser Engine (Playwright)
// Singleton browser manager. Lazily launches Chromium, manages pages.
// ═══════════════════════════════════════════════════════════════════════════

import { chromium, type Browser, type Page, type BrowserContext } from 'playwright';

export interface BrowserEngineOptions {
    headless?: boolean;
    timeout?: number;
}

// ─── Singleton ───────────────────────────────────────────────────────────

let _browser: Browser | null = null;
let _context: BrowserContext | null = null;
let _page: Page | null = null;

/**
 * Get (or lazily launch) the shared Chromium browser instance.
 */
export async function getBrowser(options: BrowserEngineOptions = {}): Promise<Browser> {
    if (!_browser || !_browser.isConnected()) {
        const headless = options.headless ?? true;
        console.log(`  [BrowserEngine] Launching Chromium (headless=${headless})…`);
        _browser = await chromium.launch({ headless });
    }
    return _browser;
}

/**
 * Get (or create) the current browsing context.
 */
export async function getContext(options: BrowserEngineOptions = {}): Promise<BrowserContext> {
    if (!_context) {
        const browser = await getBrowser(options);
        _context = await browser.newContext({
            viewport: { width: 1280, height: 720 },
            userAgent: 'AgentRepublic/1.0 (Playwright)',
        });
    }
    return _context;
}

/**
 * Get (or create) the current page. Most agent operations use a single page.
 */
export async function getPage(options: BrowserEngineOptions = {}): Promise<Page> {
    if (!_page || _page.isClosed()) {
        const context = await getContext(options);
        _page = await context.newPage();
    }
    return _page;
}

/**
 * Close the browser and reset all state.
 */
export async function closeBrowser(): Promise<void> {
    if (_page && !_page.isClosed()) {
        await _page.close().catch(() => { });
        _page = null;
    }
    if (_context) {
        await _context.close().catch(() => { });
        _context = null;
    }
    if (_browser?.isConnected()) {
        await _browser.close().catch(() => { });
        _browser = null;
    }
    console.log('  [BrowserEngine] Closed.');
}
