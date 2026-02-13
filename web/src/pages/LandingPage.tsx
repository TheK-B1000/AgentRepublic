import { AnnouncementBar } from '../components/landing/AnnouncementBar';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { LogoBar } from '../components/landing/LogoBar';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { Districts } from '../components/landing/Districts';
import { Showcase } from '../components/landing/Showcase';
import { ArchitectureDiagram } from '../components/landing/ArchitectureDiagram';
import { Testimonials } from '../components/landing/Testimonials';
import { NewsCards } from '../components/landing/NewsCards';
import { CommunitySection } from '../components/landing/CommunitySection';
import { Footer } from '../components/landing/Footer';
import { FadeIn } from '../components/ui/fade-in';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(129,140,248,0.14),transparent_26%)]" />
            <AnnouncementBar />
            <Navbar />
            <main className="w-full flex flex-col relative z-10">
                <FadeIn direction="none" duration={0.8}>
                    <Hero />
                </FadeIn>

                <FadeIn delay={0.2}>
                    <LogoBar />
                </FadeIn>

                <FadeIn>
                    <FeatureGrid />
                </FadeIn>

                <FadeIn>
                    <Districts />
                </FadeIn>

                <FadeIn>
                    <Showcase />
                </FadeIn>

                <FadeIn>
                    <ArchitectureDiagram />
                </FadeIn>

                <FadeIn>
                    <Testimonials />
                </FadeIn>

                <FadeIn>
                    <NewsCards />
                </FadeIn>

                <FadeIn>
                    <CommunitySection />
                </FadeIn>
            </main>
            <Footer />
        </div>
    );
}
