import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { Section } from '../ui/section';
import { Container } from '../ui/container';

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
        <Section id="news" className="relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

            <Container className="relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-fluid-h2 font-bold text-white mb-4">Latest Transmissions</h2>
                        <p className="text-fluid-p text-foreground/60 max-w-xl">
                            Updates from the Republic core team, research findings, and community governance logs.
                        </p>
                    </div>
                    <a href="#" className="hidden md:flex items-center gap-2 text-amber-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide group">
                        View Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <article
                            key={item.id}
                            className="group relative flex flex-col h-full bg-[#111318] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Image */}
                            <div className="h-56 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111318] to-transparent opacity-80 z-10" />
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="px-3 py-1 text-xs font-bold bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white flex items-center gap-1.5 shadow-lg">
                                        <Tag className="w-3 h-3 text-amber-400" />
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-xs font-medium text-foreground/40 mb-4 uppercase tracking-wider">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {item.date}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-foreground/60 line-clamp-3 mb-8 flex-1 leading-relaxed">
                                    {item.excerpt}
                                </p>

                                <div className="mt-auto pt-6 border-t border-white/[0.06] flex items-center justify-between">
                                    <span className="text-sm font-bold text-white group-hover:underline decoration-amber-500/50 underline-offset-4 decoration-2">
                                        Read Transmission
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12 md:hidden flex justify-center">
                    <a href="#" className="flex items-center gap-2 text-amber-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide group">
                        View Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </Container>
        </Section>
    );
}
