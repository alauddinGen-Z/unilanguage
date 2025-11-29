'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, BookOpen, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BookingSection() {
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

    const courses = [
        { id: "General English (Elementary)", label: "Elementary", icon: "🌱" },
        { id: "General English (Pre-Intermediate)", label: "Pre-Intermediate", icon: "🌿" },
        { id: "General English (Advanced)", label: "Advanced", icon: "🌳" },
        { id: "SAT Preparation", label: "SAT Prep", icon: "🎓" },
    ];

    return (
        <section id="booking" className="relative py-24 px-6 bg-gradient-orange overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* LEFT COLUMN: Copy & Benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-white space-y-8 pt-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold mb-6">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Free 30-Minute Session
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                                {t.title}
                            </h2>
                            <p className="text-xl text-white/90 leading-relaxed">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                <div className="bg-white/20 p-3 rounded-xl">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">No Commitment</h4>
                                    <p className="text-sm text-white/80">100% free assessment of your current level.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                <div className="bg-white/20 p-3 rounded-xl">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Expert Feedback</h4>
                                    <p className="text-sm text-white/80">Get a personalized learning plan instantly.</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof / Urgency */}
                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-orange-500 bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="font-bold text-lg">Join 500+ Students</p>
                                <p className="text-sm text-white/80">Limited slots available this week.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Booking Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-10"
                    >
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* 1. Course Selection - Visual Cards */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                        1. Choose Your Goal
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {courses.map((c) => (
                                            <div
                                                key={c.id}
                                                onClick={() => setCourse(c.id)}
                                                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-2 ${course === c.id
                                                    ? 'border-primary bg-orange-50 text-primary shadow-lg scale-[1.02]'
                                                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <span className="text-2xl">{c.icon}</span>
                                                <span className="font-bold text-sm">{c.label}</span>
                                                {course === c.id && (
                                                    <div className="absolute top-2 right-2 text-primary">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Personal Details */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                        2. Your Details
                                    </label>
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-secondary placeholder:text-gray-400"
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
                                                className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-secondary placeholder:text-gray-400"
                                                placeholder="+996 XXX XXX XXX"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Date & Time */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                        3. Schedule
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Date Picker */}
                                        <div className="relative custom-datepicker group">
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
                                                dateFormat="MMMM d, yyyy"
                                                placeholderText="Select Date"
                                                className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-secondary placeholder:text-gray-400 cursor-pointer text-lg"
                                                calendarClassName="beautiful-calendar"
                                                popperPlacement="bottom-start"
                                                popperClassName="z-[99999]"
                                                showPopperArrow={false}
                                                required
                                            />
                                        </div>

                                        {/* Time Select */}
                                        <div className="relative group">
                                            <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                                            {isLoading ? (
                                                <div className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-400 flex items-center">
                                                    <span className="animate-pulse">Loading slots...</span>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <select
                                                        value={time}
                                                        onChange={(e) => setTime(e.target.value)}
                                                        required
                                                        disabled={!date || availableSlots.length === 0}
                                                        className={`w-full pl-14 pr-10 py-4 border-2 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium appearance-none cursor-pointer text-lg ${!date || availableSlots.length === 0
                                                                ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-gray-50 border-gray-100 text-secondary hover:border-primary hover:bg-white'
                                                            }`}
                                                    >
                                                        <option value="" disabled>
                                                            {date
                                                                ? (availableSlots.length === 0 ? "No slots available" : "Select Time")
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
                                    className={`w-full text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 text-lg shadow-xl shadow-orange-500/20 ${isLoading || (date && availableSlots.length === 0)
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-orange hover:shadow-orange-500/40'
                                        }`}
                                >
                                    {isLoading ? 'Checking Availability...' : t.submitButton}
                                </motion.button>

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    By booking, you agree to our privacy policy. No spam, ever.
                                </p>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12 flex flex-col items-center justify-center h-full min-h-[400px]"
                            >
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <h3 className="text-3xl font-black text-secondary mb-4">
                                    {t.successTitle}
                                </h3>
                                <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
                                    {t.successMessage}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
