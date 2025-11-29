'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

interface ScheduleData {
    teacher: string;
    subject: string;
    time: string;
}

const schedules: ScheduleData[] = [
    {
        teacher: "Ms. Amina",
        subject: "General English (Elementary)",
        time: "Mon/Wed/Fri 09:00 - 10:40"
    },
    {
        teacher: "Mr. Bayish",
        subject: "IELTS Preparation",
        time: "Group A: M/W/F 14:00 | Group B: M/W/F 16:00 | Group C: T/T/S 16:00"
    },
    {
        teacher: "Mr. Green",
        subject: "General English",
        time: "Inter-A: M/W/F 16:00 | Elem: T/T/S 14:00 | Inter-B: T/T/S 16:00"
    }
];

export default function ScheduleTabs() {
    const { language } = useLanguage();
    const t = translations[language].schedule;
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 0, label: t.tabs.ielts, teacher: 'Mr. Bayish' },
        { id: 1, label: t.tabs.morningGen, teacher: 'Ms. Amina' },
        { id: 2, label: t.tabs.afternoonGen, teacher: 'Mr. Green' },
    ];

    const activeSchedule = schedules[activeTab];

    return (
        <section className="py-24 px-6 bg-secondary-light relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] mix-blend-screen animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-black text-white mb-6 tracking-tight">
                        {t.title.split(' ')[0]} <span className="text-gradient relative inline-block">
                            {t.title.split(' ').slice(1).join(' ')}
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden group ${activeTab === tab.id
                                ? 'text-white shadow-lg shadow-orange-500/25 scale-105'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-orange"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Schedule Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="grid md:grid-cols-[1.5fr,2fr] gap-12 items-center relative z-10">
                            {/* Left Column: Teacher Info */}
                            <div className="text-center md:text-left">
                                <div className="inline-block p-1 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mb-6 shadow-lg shadow-orange-500/20">
                                    <div className="w-24 h-24 rounded-full bg-secondary-light flex items-center justify-center border-4 border-white/10">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">{activeSchedule.teacher}</h3>
                                <p className="text-orange-400 font-medium text-lg mb-6">{activeSchedule.subject}</p>
                                <div className="h-1 w-20 bg-white/10 rounded-full mx-auto md:mx-0"></div>
                            </div>

                            {/* Right Column: Time Slots */}
                            <div className="space-y-6 bg-black/20 rounded-3xl p-8 border border-white/5">
                                <div className="flex items-start gap-5 group">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors duration-300">
                                        <Clock className="w-7 h-7 text-orange-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-2">{t.availableTimes}</h4>
                                        <p className="text-gray-300 leading-relaxed text-lg">{activeSchedule.time}</p>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-white/5"></div>

                                <div className="flex items-start gap-5 group">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors duration-300">
                                        <Calendar className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-2">{t.duration}</h4>
                                        <p className="text-gray-300 text-lg">{t.durationValue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-10 text-center">
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.4)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full md:w-auto min-w-[300px] bg-gradient-orange text-white font-bold py-5 px-10 rounded-2xl shadow-xl shadow-orange-500/20 transition-all duration-300 text-lg"
                            >
                                {t.bookButton}
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
