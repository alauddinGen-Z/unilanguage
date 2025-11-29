'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ConsultationModal from './ConsultationModal';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

export default function CTASection() {
    const { language } = useLanguage();
    const t = translations[language].cta;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="relative py-24 px-6 bg-gradient-orange overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Headline */}
                        <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            {t.title}
                        </h2>

                        {/* Subtext */}
                        <p className="text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                            {t.subtitle}
                        </p>

                        {/* CTA Button */}
                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 bg-white text-primary font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-card-hover transition-all duration-300"
                        >
                            {t.button}
                            <ArrowRight className="w-6 h-6" />
                        </motion.button>

                        {/* Additional Info */}
                        <p className="mt-8 text-white/80 text-sm">
                            📞 +996 500 480 909 • 📍 Bishkek, Sagynbek Supanaliev 25a/1
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Consultation Modal */}
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
