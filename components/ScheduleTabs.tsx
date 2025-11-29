'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
        <section className="py-20 px-6 bg-secondary-light">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl font-bold text-white mb-4">
                        {t.title.split(' ')[0]} <span className="text-gradient">{t.title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                    <p className="text-xl text-gray-400">
                        {t.subtitle}
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-gradient-orange text-white shadow-card-hover scale-105'
                                    : 'bg-white text-secondary hover:bg-gray-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Schedule Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl p-10 shadow-card"
                >
                    {/* Teacher Info */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-gradient-orange flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-secondary">{activeSchedule.teacher}</h3>
                            <p className="text-gray-600">{activeSchedule.subject}</p>
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-secondary mb-2">{t.availableTimes}</h4>
                                <p className="text-gray-700 leading-relaxed">{activeSchedule.time}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mt-6">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-secondary mb-2">{t.duration}</h4>
                                <p className="text-gray-700">{t.durationValue}</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-8 bg-gradient-orange text-white font-bold py-4 px-8 rounded-2xl hover:shadow-card-hover transition-all duration-300"
                    >
                        {t.bookButton}
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
