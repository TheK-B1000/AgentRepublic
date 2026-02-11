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
import { Section } from '../ui/section';
import { Container } from '../ui/container';

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
        <Section className="border-t border-white/[0.04]">
            <Container>
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">
                        Capabilities
                    </p>
                    <h2 className="text-fluid-h2 font-bold text-white tracking-tight">
                        Build with confidence
                    </h2>
                </div>

                {/* Horizontal Scroll Tabs */}
                <div className="relative mb-10 group">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0A0B0F] to-transparent z-10 pointer-events-none sm:hidden" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0A0B0F] to-transparent z-10 pointer-events-none sm:hidden" />

                    <div
                        ref={scrollRef}
                        className="flex items-center gap-2 overflow-x-auto pb-4 px-1 sm:justify-center scrollbar-hide snap-x"
                    >
                        {caps.map((c, i) => (
                            <button
                                key={c.id}
                                onClick={() => setActive(i)}
                                className={`snap-center shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap border ${active === i
                                    ? 'bg-white/[0.08] text-white border-white/[0.1] shadow-md'
                                    : 'text-foreground/50 hover:text-foreground/80 border-transparent hover:bg-white/[0.04]'
                                    }`}
                            >
                                {c.icon}
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Panel */}
                <div className="max-w-5xl mx-auto glass-card overflow-hidden shadow-2xl shadow-black/40">
                    <div className="grid md:grid-cols-2">
                        {/* Description Side */}
                        <div className="p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/[0.06] bg-white/[0.01]">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-amber-400 mb-8 border border-white/[0.05]">
                                <Code2 className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                {activeCap.label}
                            </h3>
                            <p className="text-lg text-foreground/60 leading-relaxed mb-8">
                                {activeCap.description}
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-foreground/80">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <span>Type-safe interfaces</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-foreground/80">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <span>Automatic retries</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-foreground/80">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <span>Full observability</span>
                                </li>
                            </ul>
                        </div>

                        {/* Code Side */}
                        <div className="bg-[#0D0E12] p-6 md:p-10 overflow-hidden flex items-center relative group">
                            <div className="absolute top-4 right-4 flex gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                            </div>
                            <div className="w-full overflow-x-auto">
                                <pre className="font-mono text-sm leading-relaxed text-foreground/80">
                                    <code className="language-javascript block">{activeCap.code}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
