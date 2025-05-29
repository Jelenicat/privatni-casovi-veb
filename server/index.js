import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Load service account key
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});


// Create Meet endpoint
app.post('/create-meet', async (req, res) => {
  try {
    const { ime, prezime, email, datum, vreme } = req.body;

    const client = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: client });

    const startDateTime = new Date(`${datum}T${vreme}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1h kasnije

    const event = {
      summary: `Čas sa ${ime} ${prezime}`,
      description: `Online čas zakazan preko aplikacije.`,
      start: { dateTime: startDateTime.toISOString(), timeZone: 'Europe/Belgrade' },
      end: { dateTime: endDateTime.toISOString(), timeZone: 'Europe/Belgrade' },
      conferenceData: {
        createRequest: { requestId: `${Date.now()}` },
      },
      attendees: [
        { email: email },
      ],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.hangoutLink;
    res.status(200).json({ meetLink });
  } catch (err) {
    console.error(err);
    res.status(500).send('Greška pri kreiranju Meet linka.');
  }
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
