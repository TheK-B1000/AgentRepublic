import { Zap, Shield, Globe, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Section } from '../ui/section';
import { Container } from '../ui/container';

const features = [
    {
        icon: Zap,
        title: 'Instant Ephemerality',
        description: 'Spin up disposable browser contexts and execution environments in milliseconds. Zero cleanup required.',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
    },
    {
        icon: Shield,
        title: 'Sovereign Identity',
        description: 'Agents execute with cryptographically verifiable identities and localized storage. No central dependency.',
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
    },
    {
        icon: Globe,
        title: 'Global Mesh',
        description: 'Orchestrate distributed fleets across regions. The Republic routing protocol handles latency and availability.',
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
    },
    {
        icon: Cpu,
        title: 'Deterministic Runs',
        description: 'Replay any agent session bit-for-bit. Our ledger captures every input, network event, and random seed.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
    }
];

export function FeatureGrid() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariant: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                bounce: 0.4,
                duration: 0.8
            }
        }
    };

    return (
        <Section id="features">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

            <Container className="relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-fluid-h2 font-bold text-white mb-6 tracking-tight">
                        The Infrastructure for <span className="text-gradient">Autonomous Agency</span>
                    </h2>
                    <p className="text-fluid-p text-foreground/60 max-w-2xl mx-auto">
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
                            className="glass-card p-8 group relative overflow-hidden flex flex-col h-full"
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity duration-500 ${feature.color}`}>
                                <feature.icon className="w-32 h-32 -mr-12 -mt-12 rotate-12" />
                            </div>

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color} ${feature.bg} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-sm text-foreground/60 leading-relaxed flex-grow">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </Section>
    );
}
