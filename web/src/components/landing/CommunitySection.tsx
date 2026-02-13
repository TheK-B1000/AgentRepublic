import { ArrowRight, BookOpen, ScrollText, MessageSquare } from 'lucide-react';
import { Section } from '../ui/section';
import { Container } from '../ui/container';

const actions = [
    {
        title: 'Build an Agent',
        description: 'Follow the quickstart guide and deploy your first agent in under 5 minutes.',
        href: '/dashboard',
        icon: <BookOpen className="w-6 h-6" />,
        accent: 'amber',
    },
    {
        title: 'Read the Constitution',
        description: 'Understand the rules, mandates, and safety guarantees that govern every agent.',
        href: '/dashboard',
        icon: <ScrollText className="w-6 h-6" />,
        accent: 'cyan',
    },
    {
        title: 'Join the Discussion',
        description: 'Connect with builders, share ideas, and help shape the future of the Republic.',
        href: 'https://github.com/TheK-B1000/AgentRepublic/discussions',
        icon: <MessageSquare className="w-6 h-6" />,
        accent: 'purple',
    },
];

const accentStyles: Record<string, { bg: string; text: string; border: string }> = {
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'hover:border-amber-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'hover:border-cyan-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'hover:border-purple-500/20' },
};

export function CommunitySection() {
    return (
        <Section id="community" className="border-t border-white/[0.04]">
            <Container>
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">
                        Get Involved
                    </p>
                    <h2 className="text-fluid-h2 font-bold text-white tracking-tight leading-tight">
                        Start building today
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {actions.map((a) => {
                        const s = accentStyles[a.accent];
                        return (
                            <a
                                key={a.title}
                                href={a.href}
                                className={`group glass-card p-8 sm:p-10 flex flex-col transition-all duration-300 ${s.border} hover:-translate-y-1 hover:shadow-xl`}
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${s.bg} ${s.text} mb-6 transition-transform group-hover:scale-110`}>
                                    {a.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{a.title}</h3>
                                <p className="text-sm text-foreground/60 leading-relaxed mb-8 flex-1">{a.description}</p>
                                <span className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${s.text} group-hover:gap-3 transition-all`}>
                                    Learn more <ArrowRight className="w-4 h-4" />
                                </span>
                            </a>
                        );
                    })}
                </div>
            </Container>
        </Section>
    );
}
