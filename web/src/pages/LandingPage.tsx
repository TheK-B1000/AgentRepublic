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
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <AnnouncementBar />
            <Navbar />
            <main>
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
