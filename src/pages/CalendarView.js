import React, { useEffect, useState } from 'react';
import './CalendarView.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { auth, db } from '../firebase/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const isSameDay = (date1, date2) =>
  new Date(date1).toDateString() === new Date(date2).toDateString();

export default function CalendarView() {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [terminiPoDanu, setTerminiPoDanu] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTermini = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const oznake = {};
      const poDanu = {};

      const slobodniRef = collection(db, 'profesori', user.uid, 'slobodniTermini');
      const slobodniSnap = await getDocs(slobodniRef);

      slobodniSnap.forEach(doc => {
        const dan = doc.id;
        const vremena = doc.data().vreme || [];
        oznake[dan] = oznake[dan] || { slobodan: false, zauzet: false };
        oznake[dan].slobodan = true;
        poDanu[dan] = [...(poDanu[dan] || []), ...vremena.map(v => ({ vreme: v, tip: 'slobodan' }))];
      });

      const rezRef = collection(db, 'rezervacije');
      const q = query(rezRef, where('profesorId', '==', user.uid));
      const rezSnap = await getDocs(q);

      rezSnap.forEach(docSnap => {
        const { datum, vreme, ime, prezime, nacinCasa, jitsiLink, status, email } = docSnap.data();
        if (status === 'otkazano') return;
        const ucenik = ime && prezime ? `${ime} ${prezime}` : 'Nepoznat učenik';
        oznake[datum] = oznake[datum] || { slobodan: false, zauzet: false };
        oznake[datum].zauzet = true;
        poDanu[datum] = [...(poDanu[datum] || []), {
          vreme,
          tip: 'zauzet',
          ucenik,
          nacinCasa,
          jitsiLink,
          id: docSnap.id,
          datum,
          ime,
          prezime,
          email
        }];
      });

      setMarkedDates(oznake);
      setTerminiPoDanu(poDanu);
    };

    fetchTermini();
  }, []);

  // ISPRAVLJENO: koristi lokalni datum umesto UTC
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleCancelClass = async (t) => {
    const vremePocetka = new Date(`${t.datum}T${t.vreme}`);
    const sada = new Date();

    if (vremePocetka - sada < 2 * 60 * 60 * 1000) {
      alert('Čas se može otkazati najkasnije 2 sata unapred.');
      return;
    }

    if (!window.confirm('Da li ste sigurni da želite da otkažete čas?')) return;

    try {
      const user = auth.currentUser;

      await fetch(`https://email-api-jelenas-projects-7386403f.vercel.app/api/sendEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tip: 'otkazivanje-profesor', // ✅ ispravno za profesora
          ime: t.ime || '',
          prezime: t.prezime || '',
          datum: t.datum,
          vreme: t.vreme,
          profesorEmail: user.email,
          nacinCasa: t.nacinCasa || '',
          email: t.email
        })
      });

      await updateDoc(doc(db, 'rezervacije', t.id), {
        status: 'otkazano'
      });

      alert('Čas je otkazan. Učenik je obavešten.');
      window.location.reload();
    } catch (e) {
      alert('Greška pri otkazivanju.');
      console.error(e);
    }
  };

  const prikaziTermine = () => {
    if (!selectedDate) return null;

    const termini = terminiPoDanu[selectedDate] || [];
    if (termini.length === 0) {
      return <p className="no-termins centered">📭 Nema termina za ovaj dan</p>;
    }

    return (
      <div className="appointments">
        {termini
          .sort((a, b) => a.vreme.localeCompare(b.vreme))
          .map((t, i) => (
            <div
              key={i}
              className={`appointment-item ${t.tip === 'zauzet' ? 'busy' : ''}`}
            >
              <div className="appointment-time">{t.vreme}</div>
              <div className="appointment-status">
                {t.tip === 'zauzet' ? 'Zauzet' : 'Slobodan'}

                {t.nacinCasa === 'online' && t.jitsiLink && (
                  <div>
                    <a
                      href={t.jitsiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="join-meeting-button"
                    >
                      📹 Pristupi online času
                    </a>
                  </div>
                )}

                {t.tip === 'zauzet' && (
                  <>
                    <button
                      className="join-meeting-button"
                      style={{ marginTop: '10px', backgroundColor: '#d81b60' }}
                      onClick={() => handleCancelClass(t)}
                    >
                      ❌ Otkaži čas
                    </button>
                    <p style={{ color: '#aaa', fontSize: '12px', marginTop: '5px' }}>
                      Čas se može otkazati najkasnije 2 sata unapred.
                    </p>
                  </>
                )}
              </div>
              {t.ucenik && (
                <div className="appointment-who">👤 {t.ucenik}</div>
              )}
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="calendar-view">
      <h1 className="page-title">Pregled termina</h1>

      <div className="calendar-wrapper">
        <Calendar
          onClickDay={(date) => setSelectedDate(formatDate(date))}
          tileClassName={({ date }) => {
            const key = formatDate(date);
            const d = markedDates[key];

            if (formatDate(date) === selectedDate) return 'react-calendar__tile--active';
            if (d?.zauzet && d?.slobodan) return 'mixed-day';
            if (d?.zauzet) return 'zauzet-day';
            if (d?.slobodan) return 'slobodan-day';
            return null;
          }}
        />

        {selectedDate && (
          <div className="termin-list">
            {prikaziTermine()}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            className="back-button"
            style={{
              background: 'linear-gradient(to right, #ff80ab, #f06292)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s, opacity 0.2s',
            }}
            onClick={() => navigate('/my-profile')}
            onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            ← Nazad na profil
          </button>
        </div>
      </div>
    </div>
  );
}
