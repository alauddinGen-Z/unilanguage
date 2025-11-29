'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

export default function BookingSection() {
    const { language } = useLanguage();
    const t = translations[language].modal;

    // State Management
    const [course, setCourse] = useState("General English (Elementary)");
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('+996 ');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Fetch available slots when course OR date changes
    useEffect(() => {
        if (course && date) {
            fetchAvailableSlots();
        }
    }, [course, date]);

    const fetchAvailableSlots = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/booking?date=${date}&course=${encodeURIComponent(course)}`);
            const data = await res.json();

            if (data.success && data.slots) {
                setAvailableSlots(data.slots);
                if (data.slots.length > 0) {
                    setTime(data.slots[0]);
                }
            } else {
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            setAvailableSlots([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!course) {
            alert('❌ Please select a course');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    whatsapp,
                    course,
                    date,
                    time,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitted(true);
                alert('✅ Success! Your consultation has been booked.');

                setTimeout(() => {
                    setIsSubmitted(false);
                    setCourse("General English (Elementary)");
                    setName('');
                    setWhatsapp('+996 ');
                    setDate('');
                    setTime('');
                    setAvailableSlots([]);
                }, 5000);
            } else {
                alert(`❌ Booking failed: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('❌ Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value.startsWith('+996 ')) {
            setWhatsapp('+996 ');
            return;
        }
        setWhatsapp(value);
    };

    return (
        <section id="booking" className="relative py-24 px-6 bg-gradient-orange overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

            <div className="max-w-2xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                            {t.title}
                        </h2>
                        <p className="text-xl text-white/90">
                            {t.subtitle}
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 md:p-12">
                            {!isSubmitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Course Dropdown */}
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">
                                            <BookOpen className="w-4 h-4 inline mr-2 text-primary" />
                                            Select Course
                                        </label>
                                        <select
                                            value={course}
                                            onChange={(e) => setCourse(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white cursor-pointer text-lg font-medium text-secondary"
                                        >
                                            <option value="General English (Elementary)">General English (Elementary)</option>
                                            <option value="General English (Pre-Intermediate)">General English (Pre-Intermediate)</option>
                                            <option value="General English (Advanced)">General English (Advanced)</option>
                                            <option value="SAT Preparation">SAT Preparation</option>
                                        </select>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">
                                            <User className="w-4 h-4 inline mr-2 text-primary" />
                                            {t.name}
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-lg"
                                            placeholder={t.namePlaceholder}
                                        />
                                    </div>

                                    {/* WhatsApp */}
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">
                                            <Phone className="w-4 h-4 inline mr-2 text-primary" />
                                            {t.whatsapp}
                                        </label>
                                        <input
                                            type="tel"
                                            value={whatsapp}
                                            onChange={handleWhatsappChange}
                                            required
                                            minLength={14}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-lg"
                                            placeholder="+996 XXX XXX XXX"
                                        />
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">
                                            <Calendar className="w-4 h-4 inline mr-2 text-primary" />
                                            {t.date}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-lg font-medium text-secondary"
                                                style={{ colorScheme: 'light' }}
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Calendar className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">
                                            <Clock className="w-4 h-4 inline mr-2 text-primary" />
                                            {t.time}
                                        </label>
                                        {isLoading ? (
                                            <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl">
                                                <div className="animate-pulse flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-gray-300" />
                                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                </div>
                                            </div>
                                        ) : availableSlots.length > 0 ? (
                                            <div className="relative">
                                                <select
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 pl-12 pr-10 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white appearance-none cursor-pointer text-lg font-medium text-secondary"
                                                >
                                                    {availableSlots.map((slot) => (
                                                        <option key={slot} value={slot}>
                                                            {slot}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <Clock className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : date ? (
                                            <div className="w-full px-4 py-3 border-2 border-red-200 rounded-xl text-red-600 bg-red-50">
                                                No available slots for this date
                                            </div>
                                        ) : (
                                            <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-400">
                                                Select a course and date first
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading || availableSlots.length === 0}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg ${isLoading || availableSlots.length === 0
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-orange hover:shadow-card-hover'
                                            }`}
                                    >
                                        {isLoading ? 'Processing...' : t.submitButton}
                                    </motion.button>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-20 h-20 bg-gradient-orange rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-secondary mb-3">
                                        {t.successTitle}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {t.successMessage}
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        <div className="bg-orange-50 px-8 py-6 text-center border-t border-orange-100">
                            <p className="text-sm text-gray-600">
                                📞 +996 500 480 909 • 📍 Bishkek, Sagynbek Supanaliev 25a/1
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
