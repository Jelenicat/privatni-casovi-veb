import React, { useEffect, useState } from 'react';
import './CalendarView.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { auth, db } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
        const { datum, vreme, ime, prezime, nacinCasa, jitsiLink } = docSnap.data();
        const ucenik = ime && prezime ? `${ime} ${prezime}` : 'Nepoznat učenik';
        oznake[datum] = oznake[datum] || { slobodan: false, zauzet: false };
        oznake[datum].zauzet = true;
        poDanu[datum] = [...(poDanu[datum] || []), {
          vreme,
          tip: 'zauzet',
          ucenik,
          nacinCasa,
          jitsiLink
        }];
      });

      setMarkedDates(oznake);
      setTerminiPoDanu(poDanu);
    };

    fetchTermini();
  }, []);

  const formatDate = (date) => date.toISOString().split('T')[0];

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
              </div>
              {t.ucenik && (
                <div className="appointment-who">👤 {t.ucenik}</div>
              )}
              {t.nacinCasa === 'online' && t.jitsiLink && (
                <a
                  href={t.jitsiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="join-meeting-button"
                >
                  📹 Pristupi online času
                </a>
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
