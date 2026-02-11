import { ArrowRight, Calendar, Tag } from 'lucide-react';

const news = [
    {
        id: 1,
        category: 'Release',
        title: 'Agent Republic v0.9.0: The "Foundry" Update',
        date: 'Feb 10, 2026',
        excerpt: 'Introducing the new Agent Foundry for rapid prototyping and the Chancellor governance module.',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop', // Abstract tech
        link: '#'
    },
    {
        id: 2,
        category: 'Research',
        title: 'Optimizing Multi-Agent Context Windows',
        date: 'Feb 08, 2026',
        excerpt: 'How we reduced token consumption by 40% using hierarchical memory structures.',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop', // Pattern
        link: '#'
    },
    {
        id: 3,
        category: 'Community',
        title: 'First Republic Summit Trace',
        date: 'Feb 05, 2026',
        excerpt: 'Recap of our first community governance vote on the new Constitution protocols.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', // Cyberpunk city
        link: '#'
    }
];

export function NewsCards() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-secondary)]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Latest Transmissions</h2>
                        <p className="text-[var(--text-secondary)] max-w-xl">
                            Updates from the Republic core team, research findings, and community governance logs.
                        </p>
                    </div>
                    <a href="#" className="hidden md:flex items-center gap-2 text-[var(--color-primary)] hover:text-white transition-colors text-sm font-medium group">
                        View Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <article
                            key={item.id}
                            className="group relative flex flex-col h-full bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-2xl overflow-hidden hover:border-[var(--color-primary)]/50 transition-colors duration-300"
                        >
                            {/* Image */}
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] to-transparent opacity-60 z-10" />
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="px-2.5 py-1 text-xs font-medium bg-black/60 backdrop-blur border border-white/10 rounded-full text-white flex items-center gap-1.5">
                                        <Tag className="w-3 h-3 text-[var(--color-primary)]" />
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-3">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {item.date}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-6 flex-1">
                                    {item.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                                    <span className="text-sm font-medium text-white group-hover:underline decoration-[var(--color-primary)] underline-offset-4">
                                        Read Transmission
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-8 md:hidden flex justify-center">
                    <a href="#" className="flex items-center gap-2 text-[var(--color-primary)] hover:text-white transition-colors text-sm font-medium group">
                        View Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
}
