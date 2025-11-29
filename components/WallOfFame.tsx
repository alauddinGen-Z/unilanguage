'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Award, CheckCircle, Star, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';
import { useRef } from 'react';

interface StudentResult {
    name: string;
    score: string;
    badge: string;
    quote?: string;
}

export default function WallOfFame() {
    const { language } = useLanguage();
    const t = translations[language].wallOfFame;
    // Cast to unknown first to avoid type overlap issues if translations types aren't perfect yet
    const results = t.students as unknown as StudentResult[];

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} style={{ position: 'relative' }} className="py-32 px-6 relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Gradient Blobs - White/Light for contrast against Orange */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)]"></div>
                <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-white rounded-full blur-[100px] opacity-10 animate-pulse"></div>
                <div className="absolute bottom-20 left-[-10%] w-[500px] h-[500px] bg-amber-200 rounded-full blur-[100px] opacity-20 animate-pulse delay-700"></div>

                {/* 3D Rotating Shapes (Subtle White) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[15%] left-[5%] w-96 h-96 border border-white/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-40"
                ></motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] border border-white/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-30"
                ></motion.div>

                {/* "Alive" IELTS Icons - White/Light Orange */}
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[10%] text-white/10"
                >
                    <Award className="w-48 h-48 drop-shadow-lg" /> {/* Listening/Achievement */}
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, 40, 0],
                        rotate: [0, -10, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[45%] right-[5%] text-white/10"
                >
                    <Quote className="w-64 h-64 drop-shadow-lg" /> {/* Speaking/Quote */}
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, -35, 0],
                        rotate: [0, 5, 0],
                        scale: [1, 1.15, 1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[5%] left-[15%] text-white/10"
                >
                    <CheckCircle className="w-56 h-56 drop-shadow-lg" /> {/* Reading/Writing/Success */}
                </motion.div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
                        <Star className="w-4 h-4 text-white fill-white" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Hall of Fame</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        {t.title.split(' ').slice(0, -1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-white">{t.title.split(' ').slice(-1)}</span>
                    </h2>
                    <p className="text-xl text-orange-100 font-medium max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Central Line (Desktop) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/20 -translate-x-1/2 hidden md:block rounded-full"></div>

                    {/* Animated Progress Line */}
                    <motion.div
                        style={{ scaleY, originY: 0 }}
                        className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-white via-orange-200 to-white -translate-x-1/2 hidden md:block rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    ></motion.div>

                    <div className="space-y-12 md:space-y-32 relative">
                        {results && results.map((student, index) => (
                            <motion.div
                                key={student.name}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Card Side */}
                                <div className="flex-1 w-full md:w-1/2">
                                    <div className="group relative bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-orange-900/20 border border-white/20 hover:shadow-2xl hover:shadow-orange-900/30 hover:scale-[1.02] transition-all duration-500">
                                        {/* Floating Badge */}
                                        <div className="absolute -top-6 right-8 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 rounded-2xl shadow-lg shadow-orange-600/30 transform group-hover:-translate-y-2 transition-transform duration-300">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                <span className="text-sm font-bold">IELTS</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 mb-8">
                                            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                <span className="text-4xl font-black text-orange-500">{student.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-secondary mb-2 group-hover:text-orange-600 transition-colors">{student.name}</h3>
                                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wide">{t.badge}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative bg-gray-50 rounded-2xl p-6 mb-6 group-hover:bg-orange-50/50 transition-colors duration-300">
                                            <Quote className="absolute top-4 left-4 w-6 h-6 text-orange-200" />
                                            <p className="text-gray-600 italic relative z-10 pl-8">"{student.quote}"</p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{t.overallBand}</span>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                                                {student.score}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Point (Desktop) */}
                                <div className="relative hidden md:flex items-center justify-center w-12 h-12 z-10">
                                    <div className="w-4 h-4 bg-orange-500 border-4 border-white rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.2)]"></div>
                                    <div className="absolute w-12 h-1 bg-white/30 top-1/2 -translate-y-1/2 -z-10" style={{
                                        left: index % 2 === 0 ? '50%' : 'auto',
                                        right: index % 2 === 0 ? 'auto' : '50%'
                                    }}></div>
                                </div>

                                {/* Empty Side for Balance */}
                                <div className="flex-1 hidden md:block"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
