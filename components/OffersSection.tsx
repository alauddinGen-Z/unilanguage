'use client';

import { motion } from 'framer-motion';
import { Users, Wallet, Trophy, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

interface Offer {
    title: string;
    text: string;
    icon: any;
    gradient: string;
    shadow: string;
}

export default function OffersSection() {
    const { language } = useLanguage();
    const t = translations[language].offers;

    const offers: Offer[] = [
        {
            title: t.referral.title,
            text: t.referral.text,
            icon: Users,
            gradient: "from-orange-400 to-orange-500",
            shadow: "shadow-orange-200"
        },
        {
            title: t.discount.title,
            text: t.discount.text,
            icon: Wallet,
            gradient: "from-amber-400 to-orange-400",
            shadow: "shadow-amber-200"
        },
        {
            title: t.reward.title,
            text: t.reward.text,
            icon: Trophy,
            gradient: "from-orange-500 to-red-500",
            shadow: "shadow-red-200"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <section className="py-32 px-6 relative overflow-hidden bg-white">
            {/* Subtle Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-50 rounded-full blur-[80px] opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-yellow-50 rounded-full blur-[80px] opacity-60"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100">
                        <span className="text-orange-600 font-bold text-sm tracking-wide uppercase">Limited Time Benefits</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-secondary mb-6 tracking-tight">
                        {t.title.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 relative inline-block">
                            {t.title.split(' ').slice(1).join(' ')}
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        {t.subtitle}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {offers.map((offer, index) => {
                        const Icon = offer.icon;
                        return (
                            <motion.div
                                key={offer.title}
                                variants={itemVariants}
                                whileHover={{ y: -12 }}
                                className="group relative"
                            >
                                <div className="relative h-full bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-100 border border-gray-100 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-orange-500/10 group-hover:border-orange-100">

                                    {/* Icon */}
                                    <div className="mb-8 relative">
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${offer.gradient} flex items-center justify-center shadow-lg ${offer.shadow} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                            <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-secondary mb-4 group-hover:text-orange-600 transition-colors duration-300">
                                        {offer.title}
                                    </h3>
                                    <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">
                                        {offer.text}
                                    </p>

                                    {/* Decorative Arrow */}
                                    <div className="flex items-center text-orange-500 font-bold opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                        <span className="mr-2">Learn more</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>

                                    {/* Bottom Gradient Line */}
                                    <div className={`absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r ${offer.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
