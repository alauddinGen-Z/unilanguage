import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Simple in-memory cache with 5-minute expiry for instant responses
const slotsCache = new Map<string, { slots: string[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Initialize the Google Calendar API client
function getCalendarClient() {
    const client = new JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return google.calendar({ version: 'v3', auth: client });
}

// Get available time slots for a specific calendar on a specific date
export async function getAvailableSlots(calendarId: string, date: string) {
    try {
        // Check cache first for instant response
        const cacheKey = `${calendarId}-${date}`;
        const cached = slotsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('📦 Cache hit for:', cacheKey);
            return cached.slots;
        }

        const calendar = getCalendarClient();

        // Create time boundaries for Bishkek timezone (9 AM to 6 PM)
        const startDateTime = `${date}T09:00:00`;
        const endDateTime = `${date}T18:00:00`;

        // Query for busy times in Bishkek timezone
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: startDateTime,
                timeMax: endDateTime,
                timeZone: 'Asia/Bishkek',
                items: [{ id: calendarId }],
            },
        });

        const busySlots = response.data.calendars?.[calendarId]?.busy || [];

        // Generate all possible hourly slots (9:00-18:00)
        const allSlots = [];
        for (let hour = 9; hour < 18; hour++) {
            const slotStart = `${date}T${hour.toString().padStart(2, '0')}:00:00`;
            const slotEnd = `${date}T${(hour + 1).toString().padStart(2, '0')}:00:00`;

            allSlots.push({
                start: slotStart,
                end: slotEnd,
                time: `${hour.toString().padStart(2, '0')}:00`,
            });
        }

        // Filter out busy slots
        const availableSlots = allSlots.filter((slot) => {
            return !busySlots.some((busy) => {
                const busyStart = busy.start!;
                const busyEnd = busy.end!;

                // Check if slot overlaps with busy time
                return (
                    (slot.start >= busyStart && slot.start < busyEnd) ||
                    (slot.end > busyStart && slot.end <= busyEnd) ||
                    (slot.start <= busyStart && slot.end >= busyEnd)
                );
            });
        });

        const availableTimesArray = availableSlots.map((slot) => slot.time);

        // Store in cache for fast future lookups
        slotsCache.set(cacheKey, {
            slots: availableTimesArray,
            timestamp: Date.now(),
        });

        return availableTimesArray;
    } catch (error) {
        console.error('Error fetching available slots:', error);
        throw new Error('Failed to fetch available slots');
    }
}

// Create a booking in the specified calendar
export async function createBooking(
    calendarId: string,
    eventDetails: {
        name: string;
        whatsapp: string;
        date: string;
        time: string;
        course: string;
    }
) {
    try {
        const calendar = getCalendarClient();

        // Parse time
        const [hours, minutes] = eventDetails.time.split(':').map(Number);

        // Create datetime strings in YYYY-MM-DDTHH:MM:SS format (Bishkek timezone)  
        const dateStr = eventDetails.date; // YYYY-MM-DD
        const startDateTime = `${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        const endHour = hours + 1;
        const endDateTime = `${dateStr}T${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

        const event = {
            summary: `Consultation: ${eventDetails.name}`,
            description: `Course: ${eventDetails.course}
Name: ${eventDetails.name}
WhatsApp: ${eventDetails.whatsapp}`,
            start: {
                dateTime: startDateTime,
                timeZone: 'Asia/Bishkek',
            },
            end: {
                dateTime: endDateTime,
                timeZone: 'Asia/Bishkek',
            },
        };

        const response = await calendar.events.insert({
            calendarId,
            requestBody: event,
        });

        // Clear cache for this calendar/date after booking
        const cacheKey = `${calendarId}-${eventDetails.date}`;
        slotsCache.delete(cacheKey);

        return {
            success: true,
            eventId: response.data.id,
            eventLink: response.data.htmlLink,
        };
    } catch (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
    }
}
