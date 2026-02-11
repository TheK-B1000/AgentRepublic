import { useState } from 'react';
import {
    Globe,
    Cpu,
    Search,
    Bot,
    ShieldCheck,
    Activity,
    KeyRound,
} from 'lucide-react';
import { Section } from '../ui/section';
import { Container } from '../ui/container';

interface District {
    id: string;
    label: string;
    icon: React.ReactNode;
    tagline: string;
    description: string;
    capabilities: string[];
    metric: { label: string; value: string };
}

const districts: District[] = [
    {
        id: 'workshop',
        label: 'Workshop',
        icon: <Globe className="w-5 h-5" />,
        tagline: 'Apps & Websites',
        description: 'Full-stack web development from design to deployment. Agents build landing pages, dashboards, and interactive applications with pixel-perfect execution.',
        capabilities: ['Landing page builder', 'Component generation', 'Deploy to Vercel'],
        metric: { label: 'Avg. deploy time', value: '< 90s' },
    },
    {
        id: 'foundry',
        label: 'Foundry',
        icon: <Cpu className="w-5 h-5" />,
        tagline: 'AI Models',
        description: 'Train, fine-tune, and benchmark ML models. The Foundry manages compute allocation, hyperparameter sweeps, and model evaluation pipelines.',
        capabilities: ['Model fine-tuning', 'Benchmark suites', 'Compute scheduling'],
        metric: { label: 'Models trained', value: '∞' },
    },
    {
        id: 'research',
        label: 'Research',
        icon: <Search className="w-5 h-5" />,
        tagline: 'Browse & Synthesize',
        description: 'Autonomous web research with source verification. Agents browse, extract, cross-reference, and synthesize information into structured reports.',
        capabilities: ['Web browsing', 'Source verification', 'Report generation'],
        metric: { label: 'Sources per run', value: '10-50' },
    },
    {
        id: 'automation',
        label: 'Automation',
        icon: <Bot className="w-5 h-5" />,
        tagline: 'Jarvis-like Agents',
        description: 'Personal and enterprise automation that learns your workflows. Schedule tasks, manage files, orchestrate multi-step operations across systems.',
        capabilities: ['Task scheduling', 'File management', 'API orchestration'],
        metric: { label: 'Actions/minute', value: '60+' },
    },
    {
        id: 'qa',
        label: 'QA & Safety',
        icon: <ShieldCheck className="w-5 h-5" />,
        tagline: 'Evals & Red Team',
        description: 'Continuous evaluation and adversarial testing. QA agents run golden-file evals, regression suites, and red-team probes against every agent in the Republic.',
        capabilities: ['Golden-file evals', 'Red team probes', 'SLO monitoring'],
        metric: { label: 'Pass rate', value: '25/25' },
    },
    {
        id: 'operations',
        label: 'Operations',
        icon: <Activity className="w-5 h-5" />,
        tagline: 'Monitoring & Incidents',
        description: 'Real-time observability across all districts. Operations agents monitor traces, detect anomalies, trigger alerts, and manage incident response.',
        capabilities: ['Trace monitoring', 'Anomaly detection', 'Incident response'],
        metric: { label: 'Uptime', value: '99.9%' },
    },
    {
        id: 'identity',
        label: 'Identity',
        icon: <KeyRound className="w-5 h-5" />,
        tagline: 'Permissions & Secrets',
        description: 'Centralized identity, access control, and secrets management. Every agent action is authenticated, authorized, and audited.',
        capabilities: ['RBAC policies', 'Secret rotation', 'Audit logs'],
        metric: { label: 'Auth latency', value: '< 5ms' },
    },
];

export function Districts() {
    const [active, setActive] = useState(0);
    const d = districts[active];

    return (
        <Section className="border-t border-white/[0.04]">
            <Container>
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">
                        The Republic
                    </p>
                    <h2 className="text-fluid-h2 font-bold text-white tracking-tight mb-6">
                        Seven districts. One government.
                    </h2>
                    <p className="text-fluid-p text-foreground/60 max-w-2xl mx-auto">
                        Each district is a specialized domain with its own agents, tools, and mandates — governed by a shared constitution.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {districts.map((item, i) => (
                        <button
                            key={item.id}
                            onClick={() => setActive(i)}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${active === i
                                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-105'
                                : 'bg-white/[0.03] text-foreground/60 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/[0.1]'
                                }`}
                        >
                            {item.icon}
                            <span className="hidden sm:inline">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="glass-card p-8 sm:p-12 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    {d.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{d.label}</h3>
                                    <span className="text-sm font-medium text-amber-500/80 uppercase tracking-wider">{d.tagline}</span>
                                </div>
                            </div>
                            <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                                {d.description}
                            </p>
                            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-sm text-emerald-400 font-semibold uppercase tracking-wide">{d.metric.label}:</span>
                                <span className="text-xl text-emerald-300 font-bold font-mono">{d.metric.value}</span>
                            </div>
                        </div>
                        <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.06]">
                            <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-6">
                                Core Capabilities
                            </h4>
                            <div className="space-y-3">
                                {d.capabilities.map((cap) => (
                                    <div key={cap} className="flex items-center gap-4 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                        <span className="text-md text-foreground/80">{cap}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
