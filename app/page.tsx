'use client';

import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';

// Lazy load components below the fold
const WallOfFame = dynamic(() => import('@/components/WallOfFame'), {
    loading: () => <div className="h-96 bg-orange-50 animate-pulse" />
});
const OffersSection = dynamic(() => import('@/components/OffersSection'), {
    loading: () => <div className="h-96 bg-white animate-pulse" />
});
const ScheduleTabs = dynamic(() => import('@/components/ScheduleTabs'), {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});
const BookingSection = dynamic(() => import('@/components/BookingSection'), {
    loading: () => <div className="h-96 bg-white animate-pulse" />
});

export default function Home() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <WallOfFame />
            <OffersSection />
            <ScheduleTabs />
            <BookingSection />
        </main>
    );
}
