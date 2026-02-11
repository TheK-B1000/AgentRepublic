import { AnnouncementBar } from '../components/landing/AnnouncementBar';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { LogoBar } from '../components/landing/LogoBar';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { Districts } from '../components/landing/Districts';
import { Testimonials } from '../components/landing/Testimonials';
import { CommunitySection } from '../components/landing/CommunitySection';
import { Footer } from '../components/landing/Footer';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <AnnouncementBar />
            <Navbar />
            <main>
                <Hero />
                <LogoBar />
                <FeatureGrid />
                <Districts />
                <Testimonials />
                <CommunitySection />
            </main>
            <Footer />
        </div>
    );
}
