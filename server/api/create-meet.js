import { google } from 'googleapis';
import applyCors from '../utils/cors.js';

export default async function handler(req, res) {
  const isPreflight = applyCors(req, res);
  if (isPreflight) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  try {
    const {
      ime,
      prezime,
      email,
      datum,
      vreme,
      profesorEmail
    } = req.body;

    if (!ime || !prezime || !email || !datum || !vreme || !profesorEmail) {
      return res.status(400).json({ message: 'Nedostaju podaci' });
    }

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );
    await auth.authorize();
    const calendar = google.calendar({ version: 'v3', auth });

    const start = new Date(`${datum}T${vreme}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Čas sa ${ime} ${prezime}`,
      description: 'Privatni čas zakazan putem aplikacije.',
      start: { dateTime: start.toISOString(), timeZone: 'Europe/Belgrade' },
      end: { dateTime: end.toISOString(), timeZone: 'Europe/Belgrade' },
      attendees: [
        { email },
        { email: profesorEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: String(Date.now()),
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
      conferenceDataVersion: 1
    });

    const meetLink = response.data?.hangoutLink;

    return res.status(200).json({
      message: 'Događaj kreiran.',
      meetLink,
      eventId: response.data.id
    });

  } catch (error) {
    console.error('Greška:', error);
    return res.status(500).json({ message: 'Greška pri kreiranju događaja', error: error.message });
  }
}
