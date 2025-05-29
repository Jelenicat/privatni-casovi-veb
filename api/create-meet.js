import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Samo POST metoda je dozvoljena.' });
  }

  try {
    const { ime, prezime, email, datum, vreme } = req.body;

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const client = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: client });

    const startDateTime = new Date(`${datum}T${vreme}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1h

    const event = {
      summary: `Čas sa ${ime} ${prezime}`,
      description: 'Online čas zakazan preko aplikacije.',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Belgrade',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Belgrade',
      },
      conferenceData: {
        createRequest: { requestId: `${Date.now()}` },
      },
      attendees: [{ email }],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.hangoutLink;
    res.status(200).json({ hangoutLink: meetLink });
  } catch (error) {
    console.error('Greška pri kreiranju Google Meet linka:', error);
    res.status(500).json({ error: 'Greška pri kreiranju Google Meet linka.' });
  }
}
