import { google } from 'googleapis';
import applyCors from '../../utils/cors'; // putanja zavisi od strukture

export default async function handler(req, res) {
  // ✅ CORS primeni
  const isPreflight = applyCors(req, res);
  if (isPreflight) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Samo POST metoda je dozvoljena.' });
  }

  try {
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const jwtClient = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    await jwtClient.authorize();
    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const { ime, prezime, email, datum, vreme } = req.body;
    const start = new Date(`${datum}T${vreme}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Čas sa ${ime} ${prezime}`,
      description: 'Privatni čas zakazan putem aplikacije.',
      start: {
        dateTime: start.toISOString(),
        timeZone: 'Europe/Belgrade',
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'Europe/Belgrade',
      },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const result = await calendar.events.insert({
      calendarId: 'jelenatanaskovicj@gmail.com',
      resource: event,
      conferenceDataVersion: 1,
    });

    return res.status(200).json({ hangoutLink: result.data?.hangoutLink });
 } catch (error) {
  console.error('❌ GRESKA u create-meet.js:', error.response?.data || error.message || error);
  return res.status(500).json({
    error: 'Neuspešno generisanje Meet linka',
    detalji: error.response?.data || error.message || error,
  });
}

}
