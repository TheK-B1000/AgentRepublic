import { Zap, Shield, Globe, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Zap,
        title: 'Instant Ephemerality',
        description: 'Spin up disposable browser contexts and execution environments in milliseconds. Zero cleanup required.',
        color: 'text-amber-400',
    },
    {
        icon: Shield,
        title: 'Sovereign Identity',
        description: 'Agents execute with cryptographically verifiable identities and localized storage. No central dependency.',
        color: 'text-cyan-400',
    },
    {
        icon: Globe,
        title: 'Global Mesh',
        description: 'Orchestrate distributed fleets across regions. The Republic routing protocol handles latency and availability.',
        color: 'text-purple-400',
    },
    {
        icon: Cpu,
        title: 'Deterministic Runs',
        description: 'Replay any agent session bit-for-bit. Our ledger captures every input, network event, and random seed.',
        color: 'text-emerald-400',
    }
];

export function FeatureGrid() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        The Infrastructure for <span className="text-[var(--color-primary)]">Autonomous Agency</span>
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)]">
                        Agent Republic provides the primitives, protocols, and governance layers needed to scale AI fleets from prototypes to civilization-grade availability.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariant}
                            className="glass-card p-6 hover:bg-white/[0.02] transition-colors group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity ${feature.color}`}>
                                <feature.icon className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
                            </div>

                            <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${feature.color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-6 h-6" />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
