import HeroSection from '@/components/HeroSection';
import OffersSection from '@/components/OffersSection';
import ScheduleTabs from '@/components/ScheduleTabs';
import WallOfFame from '@/components/WallOfFame';
import BookingSection from '@/components/BookingSection';

export default function Home() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <OffersSection />
            <ScheduleTabs />
            <WallOfFame />
            <BookingSection />
        </main>
    );
}
