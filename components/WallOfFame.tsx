'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

interface StudentResult {
    name: string;
    score: string;
    badge: string;
}

const results: StudentResult[] = [
    { name: "Asamdinova Khanbike", score: "7.5", badge: "Passed on 1st Attempt" },
    { name: "Aldashov Syrgak", score: "7.0", badge: "Passed on 1st Attempt" },
    { name: "Kadyrkulova Gulnur", score: "6.5", badge: "Passed on 1st Attempt" }
];

export default function WallOfFame() {
    const { language } = useLanguage();
    const t = translations[language].wallOfFame;

    return (
        <section className="py-20 px-6 bg-gradient-to-b from-white to-orange-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl font-bold text-secondary mb-4">
                        {t.title.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{t.title.split(' ').slice(-1)}</span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        {t.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {results.map((student, index) => (
                        <motion.div
                            key={student.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(255, 107, 0, 0.3)' }}
                            className="bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300"
                        >
                            {/* Certificate Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Award className="w-6 h-6 text-primary" />
                                    <span className="text-sm font-semibold text-gray-600">IELTS</span>
                                </div>
                                <div className="bg-gradient-orange text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {t.badge.split(' ')[0]} {t.badge.split(' ')[1]}
                                </div>
                            </div>

                            {/* Score Display */}
                            <div className="text-center mb-6">
                                <div className="inline-block bg-gradient-orange p-1 rounded-2xl mb-4">
                                    <div className="bg-white rounded-xl px-8 py-6">
                                        <div className="text-7xl font-black text-gradient">
                                            {student.score}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">{t.overallBand}</p>
                            </div>

                            {/* Student Name */}
                            <div className="text-center pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-secondary mb-2">{student.name}</h3>
                                <div className="flex items-center justify-center gap-2 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">{t.badge}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
