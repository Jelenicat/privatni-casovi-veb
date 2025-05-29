import { google } from 'googleapis';

export default async function handler(req, res) {
  // ✅ CORS zaglavlja – PRAVA DOZVOLA za tvoj domen
  res.setHeader('Access-Control-Allow-Origin', 'https://www.pronadjiprofesora.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin'); // 📌 Ovo je važno za pravilno CORS keširanje

  // ✅ Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Samo POST metoda je dozvoljena.' });
  }

  try {
    // 🔑 Autentikacija preko Service Account
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const jwtClient = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    await jwtClient.authorize();
    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    // 🕓 Podaci o događaju
    const { ime, prezime, email, datum, vreme } = req.body;
    const start = new Date(`${datum}T${vreme}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h kasnije

    // 📅 Event sa Google Meet linkom
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
          requestId: `${Date.now()}`, // mora biti jedinstven
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const result = await calendar.events.insert({
      calendarId: 'jelenatanaskovicj@gmail.com', // tvoj kalendar
      resource: event,
      conferenceDataVersion: 1,
    });

    return res.status(200).json({ hangoutLink: result.data?.hangoutLink });
  } catch (error) {
    console.error('❌ GRESKA u create-meet.js:', error);
    return res.status(500).json({
      error: 'Neuspešno generisanje Meet linka',
      detalji: error.message,
    });
  }
}
