'use client';

import { motion } from 'framer-motion';
import { Users, Wallet, Trophy } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

interface Offer {
    title: string;
    text: string;
    icon: any;
    gradient: string;
}

export default function OffersSection() {
    const { language } = useLanguage();
    const t = translations[language].offers;

    const offers: Offer[] = [
        {
            title: t.referral.title,
            text: t.referral.text,
            icon: Users,
            gradient: "from-orange-400 to-orange-600"
        },
        {
            title: t.discount.title,
            text: t.discount.text,
            icon: Wallet,
            gradient: "from-orange-500 to-orange-700"
        },
        {
            title: t.reward.title,
            text: t.reward.text,
            icon: Trophy,
            gradient: "from-orange-600 to-orange-800"
        }
    ];

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl font-bold text-secondary mb-4">
                        {t.title.split(' ')[0]} <span className="text-gradient">{t.title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        {t.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {offers.map((offer, index) => {
                        const Icon = offer.icon;
                        return (
                            <motion.div
                                key={offer.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -10 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-orange rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <div className="relative bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border-2 border-orange-100">
                                    {/* Icon */}
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${offer.gradient} flex items-center justify-center mb-6 mx-auto`}>
                                        <Icon className="w-10 h-10 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-secondary text-center mb-4">
                                        {offer.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-lg text-gray-700 text-center leading-relaxed">
                                        {offer.text}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
