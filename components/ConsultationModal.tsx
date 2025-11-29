'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
    const { language } = useLanguage();
    const t = translations[language].modal;

    // State Management - Separate variables as requested
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
                // Auto-select first available slot
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

        // Verify course is not empty
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

                // Reset form after 3 seconds
                setTimeout(() => {
                    setIsSubmitted(false);
                    setCourse("General English (Elementary)");
                    setName('');
                    setWhatsapp('+996 ');
                    setDate('');
                    setTime('');
                    setAvailableSlots([]);
                    onClose();
                }, 3000);
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
        // Ensure WhatsApp field always starts with +996
        if (!value.startsWith('+996 ')) {
            setWhatsapp('+996 ');
            return;
        }
        setWhatsapp(value);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-orange px-8 py-6 text-white">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
                            <p className="text-white/90">{t.subtitle}</p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {!isSubmitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* FIRST FIELD: Course Dropdown */}
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

                                    {/* Name Input */}
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
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                                            placeholder={t.namePlaceholder}
                                        />
                                    </div>

                                    {/* WhatsApp Input */}
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
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                                            placeholder="+996 XXX XXX XXX"
                                        />
                                    </div>

                                    {/* Date Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">
                                            <Calendar className="w-4 h-4 inline mr-2 text-primary" />
                                            {t.date}
                                        </label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Time Dropdown */}
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">
                                            <Clock className="w-4 h-4 inline mr-2 text-primary" />
                                            {t.time}
                                        </label>
                                        {isLoading ? (
                                            <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-500">
                                                Loading available times...
                                            </div>
                                        ) : availableSlots.length > 0 ? (
                                            <select
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white"
                                            >
                                                {availableSlots.map((slot) => (
                                                    <option key={slot} value={slot}>
                                                        {slot}
                                                    </option>
                                                ))}
                                            </select>
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

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading || availableSlots.length === 0}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 ${isLoading || availableSlots.length === 0
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-orange hover:shadow-card-hover'
                                            }`}
                                    >
                                        {isLoading ? 'Processing...' : t.submitButton}
                                    </motion.button>
                                </form>
                            ) : (
                                // Success Message
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-20 h-20 bg-gradient-orange rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg
                                            className="w-10 h-10 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
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
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
