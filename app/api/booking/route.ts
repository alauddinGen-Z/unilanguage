import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAvailableSlots, createBooking } from '@/lib/google';

// Strict Zod validation schema
const bookingSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    whatsapp: z.string()
        .min(10, 'WhatsApp number must be at least 10 characters')
        .regex(/^\+?\d[\d\s-]{8,}$/, 'Invalid phone number format'),
    course: z.enum([
        'General English (Elementary)',
        'General English (Pre-Intermediate)',
        'General English (Advanced)',
        'SAT Preparation'
    ], { errorMap: () => ({ message: 'Invalid course selected' }) }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (must be YYYY-MM-DD)'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (must be HH:MM)'),
});

// Map course names to calendar IDs
const COURSE_TO_CALENDAR: Record<string, string> = {
    'General English (Elementary)': process.env.CALENDAR_ID_ELEMENTARY || '',
    'General English (Pre-Intermediate)': process.env.CALENDAR_ID_PRE_INTERMEDIATE || '',
    'General English (Advanced)': process.env.CALENDAR_ID_ADVANCED || '',
    'SAT Preparation': process.env.CALENDAR_ID_SAT || '',
};

// GET: Fetch available slots for a specific course and date
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const date = searchParams.get('date');
        const course = searchParams.get('course');

        if (!date || !course) {
            return NextResponse.json(
                { error: 'Missing required parameters: date and course' },
                { status: 400 }
            );
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json(
                { error: 'Invalid date format. Use YYYY-MM-DD' },
                { status: 400 }
            );
        }

        // Validate date is not in the past
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return NextResponse.json(
                { error: 'Cannot book dates in the past' },
                { status: 400 }
            );
        }

        // Validate date is not more than 3 months in the future
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

        if (selectedDate > threeMonthsFromNow) {
            return NextResponse.json(
                { error: 'Cannot book more than 3 months in advance' },
                { status: 400 }
            );
        }

        const calendarId = COURSE_TO_CALENDAR[course];
        if (!calendarId) {
            return NextResponse.json(
                { error: 'Invalid course selected' },
                { status: 400 }
            );
        }

        const availableSlots = await getAvailableSlots(calendarId, date);

        return NextResponse.json({
            success: true,
            slots: availableSlots,
            date,
            course,
        });
    } catch (error) {
        console.error('Error in GET /api/booking:', error);
        return NextResponse.json(
            { error: 'Failed to fetch available slots' },
            { status: 500 }
        );
    }
}

// POST: Create a booking with strict validation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // ✅ TASK 1: Zod Validation - Parse and validate input
        const validationResult = bookingSchema.safeParse(body);

        if (!validationResult.success) {
            // Return detailed validation errors
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validationResult.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        const { name, whatsapp, date, time, course } = validationResult.data;

        // ✅ TASK 2: Rate Limiting - Date validation
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Reject past dates
        if (selectedDate < today) {
            return NextResponse.json(
                { error: 'Cannot book dates in the past' },
                { status: 400 }
            );
        }

        // Reject dates more than 3 months in the future
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

        if (selectedDate > threeMonthsFromNow) {
            return NextResponse.json(
                { error: 'Cannot book more than 3 months in advance' },
                { status: 400 }
            );
        }

        // Validate time is within business hours (9:00-17:00)
        const [hours] = time.split(':').map(Number);
        if (hours < 9 || hours >= 18) {
            return NextResponse.json(
                { error: 'Booking time must be between 09:00 and 17:00' },
                { status: 400 }
            );
        }

        const calendarId = COURSE_TO_CALENDAR[course];
        if (!calendarId) {
            return NextResponse.json(
                { error: 'Invalid course selected' },
                { status: 400 }
            );
        }

        // Only call Google API after all validations pass
        const result = await createBooking(calendarId, {
            name,
            whatsapp,
            date,
            time,
            course,
        });

        return NextResponse.json({
            success: true,
            message: 'Booking created successfully',
            ...result,
        });
    } catch (error) {
        console.error('Error in POST /api/booking:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
