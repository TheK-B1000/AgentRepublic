import { Shield, Zap, Search, Landmark } from 'lucide-react';

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    accent: string;
}

const features: Feature[] = [
    {
        icon: <Shield className="w-6 h-6" />,
        title: 'Deterministic Runs',
        description: 'Every agent execution is traced, validated, and verifiable. No more "it worked on my machine."',
        accent: 'amber',
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: 'Pilot Army',
        description: 'Parallel agents in formation — reduce time-to-complete by 3-5×. Think fighter jets, not chatbots.',
        accent: 'cyan',
    },
    {
        icon: <Search className="w-6 h-6" />,
        title: 'Full Observability',
        description: 'Run IDs, trace spans, cost ledgers, SLO dashboards. If it isn\'t traced, it didn\'t happen.',
        accent: 'emerald',
    },
    {
        icon: <Landmark className="w-6 h-6" />,
        title: 'Governed by Design',
        description: 'Constitution, RBAC, eval gates — agents can\'t self-escalate privileges. Safety is structural.',
        accent: 'purple',
    },
];

const accentColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    amber: { bg: 'bg-amber-500/10', border: 'group-hover:border-amber-500/20', text: 'text-amber-400', glow: 'group-hover:shadow-amber-500/5' },
    cyan: { bg: 'bg-cyan-500/10', border: 'group-hover:border-cyan-500/20', text: 'text-cyan-400', glow: 'group-hover:shadow-cyan-500/5' },
    emerald: { bg: 'bg-emerald-500/10', border: 'group-hover:border-emerald-500/20', text: 'text-emerald-400', glow: 'group-hover:shadow-emerald-500/5' },
    purple: { bg: 'bg-purple-500/10', border: 'group-hover:border-purple-500/20', text: 'text-purple-400', glow: 'group-hover:shadow-purple-500/5' },
};

export function FeatureGrid() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-3">
                        Core Capabilities
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Built for production, not prototypes
                    </h2>
                    <p className="mt-4 text-foreground/50 max-w-lg mx-auto">
                        Agent Republic provides the infrastructure layer between raw LLM calls
                        and reliable, auditable automation.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                    {features.map((f) => {
                        const colors = accentColors[f.accent];
                        return (
                            <div
                                key={f.title}
                                className={`group glass-card p-6 transition-all duration-300 hover:bg-white/[0.04] ${colors.border} ${colors.glow} hover:shadow-lg`}
                            >
                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colors.bg} ${colors.text} mb-4`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-foreground/50 leading-relaxed">{f.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
