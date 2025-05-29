import { google } from 'googleapis';

export default async function handler(req, res) {
  // ✅ CORS zaglavlja
  res.setHeader('Access-Control-Allow-Origin', 'https://www.pronadjiprofesora.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Rešavanje OPTIONS preflight zahteva
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ Dozvoljena samo POST metoda
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Samo POST metoda je dozvoljena.' });
  }

  try {
    console.log('📩 Primljen zahtev:', req.body);

    // 🔐 Parsiranje service account podataka iz environment promenljive
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    console.log('🔑 Service account parsed');

    // 🛂 Kreiranje JWT klijenta
    const jwtClient = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    await jwtClient.authorize();
    console.log('✅ Autorizovan Google klijent');

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    // 📅 Priprema događaja
    const { ime, prezime, email, datum, vreme } = req.body;
    const start = new Date(`${datum}T${vreme}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 sat

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
        },
      },
    };

    // 📤 Slanje događaja Google Calendar-u
    const result = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    console.log('📅 Google Meet link:', result.data?.hangoutLink);

    // ✅ Odgovor
    res.status(200).json({ hangoutLink: result.data?.hangoutLink });
  } catch (error) {
    console.error('❌ GRESKA u create-meet.js:', error);
    res.status(500).json({
      error: 'Neuspešno generisanje Meet linka',
      detalji: error.message,
    });
  }
}
