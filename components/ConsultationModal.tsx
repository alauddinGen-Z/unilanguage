'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, CheckCircle2, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
    const { language } = useLanguage();
    const t = translations[language].modal;

    // State Management
    const [course, setCourse] = useState("General English (Elementary)");
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('+996 ');
    const [date, setDate] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
        if (!value.startsWith('+996 ')) {
            setWhatsapp('+996 ');
            return;
        }
        setWhatsapp(value);
    };

    const courses = [
        { id: "General English (Elementary)", label: "Elementary", icon: "🌱" },
        { id: "General English (Pre-Intermediate)", label: "Pre-Int", icon: "🌿" },
        { id: "General English (Advanced)", label: "Advanced", icon: "🌳" },
        { id: "SAT Preparation", label: "SAT Prep", icon: "🎓" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-orange px-8 py-6 text-white relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-3xl font-black mb-2">{t.title}</h2>
                            <p className="text-white/90 font-medium">{t.subtitle}</p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {!isSubmitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* Course Selection - Compact Cards */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            1. Choose Goal
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {courses.map((c) => (
                                                <div
                                                    key={c.id}
                                                    onClick={() => setCourse(c.id)}
                                                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${course === c.id
                                                        ? 'border-primary bg-orange-50 text-primary shadow-sm'
                                                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <span className="text-xl">{c.icon}</span>
                                                    <span className="font-bold text-sm">{c.label}</span>
                                                    {course === c.id && (
                                                        <CheckCircle2 className="w-4 h-4 ml-auto" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Personal Details */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            2. Details
                                        </label>
                                        <div className="space-y-3">
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                    className="w-full pl-14 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-secondary placeholder:text-gray-400 text-base"
                                                    placeholder={t.namePlaceholder}
                                                />
                                            </div>
                                            <div className="relative group">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="tel"
                                                    value={whatsapp}
                                                    onChange={handleWhatsappChange}
                                                    required
                                                    minLength={14}
                                                    className="w-full pl-14 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-secondary placeholder:text-gray-400 text-base"
                                                    placeholder="+996 XXX XXX XXX"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date & Time */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            3. Schedule
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative custom-datepicker group w-full">
                                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary z-10 transition-colors" />
                                                <DatePicker
                                                    selected={selectedDate}
                                                    onChange={(date) => {
                                                        setSelectedDate(date);
                                                        if (date) {
                                                            setDate(date.toISOString().split('T')[0]);
                                                        }
                                                    }}
                                                    minDate={new Date()}
                                                    dateFormat="MMM d, yyyy"
                                                    placeholderText="Select Date"
                                                    className="w-full h-12 pl-14 pr-4 bg-gray-50 border border-gray-300 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-secondary placeholder:text-gray-400 cursor-pointer text-base"
                                                    calendarClassName="beautiful-calendar"
                                                    popperPlacement="bottom-start"
                                                    popperClassName="z-[99999]"
                                                    showPopperArrow={false}
                                                    required
                                                />
                                            </div>

                                            <div className="relative group w-full">
                                                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                                                {isLoading ? (
                                                    <div className="w-full h-12 pl-14 pr-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-400 text-base flex items-center">
                                                        <span className="animate-pulse">Loading...</span>
                                                    </div>
                                                ) : (
                                                    <div className="relative w-full">
                                                        <select
                                                            value={time}
                                                            onChange={(e) => setTime(e.target.value)}
                                                            required
                                                            disabled={Boolean(!date || availableSlots.length === 0)}
                                                            className={`w-full h-12 pl-14 pr-10 border border-gray-300 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium appearance-none cursor-pointer text-base ${!date || availableSlots.length === 0
                                                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                                : 'bg-gray-50 text-secondary hover:border-primary hover:bg-white'
                                                                }`}
                                                        >
                                                            <option value="" disabled>
                                                                {date
                                                                    ? (availableSlots.length === 0 ? "No slots" : "Select Time")
                                                                    : "Select Date First"
                                                                }
                                                            </option>
                                                            {availableSlots.map((slot) => (
                                                                <option key={slot} value={slot}>
                                                                    {slot}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading || (date && availableSlots.length === 0)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg shadow-orange-500/20 ${isLoading || (date && availableSlots.length === 0)
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-orange hover:shadow-orange-500/40'
                                            }`}
                                    >
                                        {isLoading ? 'Checking...' : t.submitButton}
                                    </motion.button>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-secondary mb-3">
                                        {t.successTitle}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed whitespace-pre-line">
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
