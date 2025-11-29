'use client';

import { motion } from 'framer-motion';
import { Phone, Instagram } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

export default function HeroSection() {
    const { language, setLanguage } = useLanguage();
    const t = translations[language].hero;

    const scrollToBooking = () => {
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-orange-50 to-white overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-orange rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Language Toggle */}
                    <div className="flex gap-2 mb-8">
                        {language !== 'en' && (
                            <button
                                onClick={() => setLanguage('en')}
                                className="px-4 py-2 rounded-full font-semibold transition-all bg-gray-200 text-gray-600 hover:bg-gray-300"
                            >
                                English
                            </button>
                        )}
                        <button
                            onClick={() => setLanguage('ru')}
                            className={`px-4 py-2 rounded-full font-semibold transition-all ${language === 'ru'
                                    ? 'bg-gradient-orange text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            Русский
                        </button>
                        <button
                            onClick={() => setLanguage('kg')}
                            className={`px-4 py-2 rounded-full font-semibold transition-all ${language === 'kg'
                                    ? 'bg-gradient-orange text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            Кыргызча
                        </button>
                    </div>

                    {/* Headline */}
                    <motion.h1
                        key={language}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl lg:text-7xl font-black text-secondary mb-6 leading-tight"
                    >
                        {t.slogan}
                    </motion.h1>

                    <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
                        {t.subtitle}
                    </p>

                    {/* CTA Button */}
                    <motion.button
                        onClick={scrollToBooking}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-orange text-white font-bold text-xl px-10 py-5 rounded-2xl shadow-card-hover hover:shadow-2xl transition-all duration-300"
                    >
                        {t.cta}
                    </motion.button>

                    {/* Contact Info */}
                    <div className="mt-10 flex flex-wrap gap-6">
                        <a href="tel:+996500480909" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                            <Phone className="w-5 h-5" />
                            <span className="font-semibold">+996 500 480 909</span>
                        </a>
                        <a href="https://instagram.com/uni.language_hub" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                            <Instagram className="w-5 h-5" />
                            <span className="font-semibold">@uni.language_hub</span>
                        </a>
                    </div>
                </motion.div>

                {/* Right Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative w-full h-[500px] flex items-center justify-center">
                        {/* 3D Shape Placeholder */}
                        <div className="relative w-80 h-80">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-2xl"
                            ></motion.div>
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-10 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] shadow-xl opacity-80"
                            ></motion.div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white z-10">
                                    <div className="text-6xl font-black mb-2">UNI</div>
                                    <div className="text-xl font-semibold">Language Hub</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Ticker Tape */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-orange text-white py-4 overflow-hidden">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="whitespace-nowrap text-lg font-bold"
                >
                    {[...Array(2)].map((_, i) => (
                        <span key={i} className="inline-block px-8">{t.ticker}</span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
