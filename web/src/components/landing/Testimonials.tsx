const quotes = [
    {
        text: 'A chatbot hopes. An agent verifies.',
        source: 'Agent Republic Handbook',
        accent: 'amber',
    },
    {
        text: 'Every human intervention is a bug report against your automation.',
        source: 'The First Principle',
        accent: 'cyan',
    },
    {
        text: 'Ship the Unicorn: beautiful AND robust.',
        source: 'Design Philosophy',
        accent: 'purple',
    },
];

const accentMap: Record<string, string> = {
    amber: 'border-amber-500/20 text-amber-400',
    cyan: 'border-cyan-500/20 text-cyan-400',
    purple: 'border-purple-500/20 text-purple-400',
};

export function Testimonials() {
    return (
        <section className="py-24 border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-3">
                        Design Philosophy
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Principles we ship by
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {quotes.map((q) => (
                        <div
                            key={q.text}
                            className={`glass-card p-8 flex flex-col justify-between border ${accentMap[q.accent]} transition-all duration-300`}
                        >
                            <blockquote className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-6">
                                "{q.text}"
                            </blockquote>
                            <cite className="text-xs text-foreground/40 not-italic">
                                — {q.source}
                            </cite>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
