import { useState, useRef, useEffect } from 'react';
import {
    Code2,
    TerminalSquare,
    Globe,
    Database,
    FileJson,
    Cpu,
    CheckCircle2,
} from 'lucide-react';

const caps = [
    {
        id: 'browser',
        label: 'Browser Control',
        icon: <Globe className="w-4 h-4" />,
        description: 'Headless browser automation with anti-detection.',
        code: `// Navigator Agent
await browser.goto('https://example.com');
const data = await browser.evaluate(() => {
  return document.title;
});
await browser.click('#submit-btn');`,
    },
    {
        id: 'terminal',
        label: 'Code Execution',
        icon: <TerminalSquare className="w-4 h-4" />,
        description: 'Sandboxed shell execution for scripts and tools.',
        code: `// Engineer Agent
const result = await exec('npm test', {
  cwd: './project',
  timeout: 30000
});
if (result.exitCode === 0) {
  return 'Tests passed';
}`,
    },
    {
        id: 'data',
        label: 'Research',
        icon: <Database className="w-4 h-4" />,
        description: 'Deep web research and data synthesis.',
        code: `// Researcher Agent
const sources = await search('quantum computing trends');
const report = await synthesize(sources, {
  format: 'markdown',
  citations: true
});
await fs.writeFile('report.md', report);`,
    },
    {
        id: 'files',
        label: 'File Ops',
        icon: <FileJson className="w-4 h-4" />,
        description: 'Read, write, and patch files with validation.',
        code: `// Editor Agent
await fs.patch('config.json', [
  { op: 'replace', path: '/debug', value: true }
]);
const valid = await validateJson('config.json');`,
    },
    {
        id: 'models',
        label: 'Model Comms',
        icon: <Cpu className="w-4 h-4" />,
        description: 'Structured communication with any LLM provider.',
        code: `// Planner Agent
const plan = await llm.chat({
  role: 'architect',
  messages: history,
  schema: PlanSchema
});
return plan.nextStep;`,
    },
];

export function Showcase() {
    const [active, setActive] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll the active tab into view
    useEffect(() => {
        if (scrollRef.current) {
            const btn = scrollRef.current.children[active] as HTMLElement;
            if (btn) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [active]);

    const activeCap = caps[active];

    return (
        <section className="py-24 border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-3">
                        Capabilities
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Build with confidence
                    </h2>
                </div>

                {/* Horizontal Scroll Tabs */}
                <div className="relative mb-8">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0A0B0F] to-transparent z-10 pointer-events-none sm:hidden" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0A0B0F] to-transparent z-10 pointer-events-none sm:hidden" />

                    <div
                        ref={scrollRef}
                        className="flex items-center gap-2 overflow-x-auto pb-4 px-6 sm:justify-center scrollbar-hide snap-x"
                    >
                        {caps.map((c, i) => (
                            <button
                                key={c.id}
                                onClick={() => setActive(i)}
                                className={`snap-center shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${active === i
                                        ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                                        : 'text-foreground/50 hover:text-foreground/70 border border-transparent hover:bg-white/[0.02]'
                                    }`}
                            >
                                {c.icon}
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Panel */}
                <div className="max-w-4xl mx-auto glass-card overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        {/* Description Side */}
                        <div className="p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/[0.06] bg-white/[0.01]">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {activeCap.label}
                            </h3>
                            <p className="text-foreground/60 leading-relaxed mb-6">
                                {activeCap.description}
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-foreground/70">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Type-safe interfaces</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-foreground/70">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Automatic retries</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-foreground/70">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Full observability</span>
                                </li>
                            </ul>
                        </div>

                        {/* Code Side */}
                        <div className="bg-[#0D0E12] p-6 md:p-8 overflow-x-auto flex items-center">
                            <pre className="font-mono text-xs sm:text-sm leading-relaxed text-foreground/80">
                                <div className="flex gap-1.5 mb-4 opacity-30">
                                    <div className="w-3 h-3 rounded-full bg-white" />
                                    <div className="w-3 h-3 rounded-full bg-white" />
                                    <div className="w-3 h-3 rounded-full bg-white" />
                                </div>
                                <code>{activeCap.code}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
