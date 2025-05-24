import React, { useEffect, useState } from 'react';
import './AddAvailability.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { auth, db } from '../firebase/firebase';
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const formatDate = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
};

const getDateWithoutTimezoneShift = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export default function AddAvailability() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [savedSlots, setSavedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [userId, setUserId] = useState(null);
  const [duration, setDuration] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return navigate('/login');
      setUserId(user.uid);
      const snap = await getDoc(doc(db, 'profesori', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        if (data.trajanjeCasa) setDuration(Number(data.trajanjeCasa));
      }
    });
    return unsubscribe;
  }, [navigate]);

  const generateTimeSlots = () => {
    const slots = [];
    const startMinutes = 8 * 60;
    const endMinutes = 22 * 60;

    for (let current = startMinutes; current + duration <= endMinutes; current += duration) {
      const hours = String(Math.floor(current / 60)).padStart(2, '0');
      const mins = String(current % 60).padStart(2, '0');
      slots.push(`${hours}:${mins}`);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const toggleSlot = (time) => {
    if (bookedSlots.includes(time)) return;

    const todayStr = formatDate(new Date());
    if (selectedDate === todayStr) {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      if (slotTime <= now) {
        alert('Ne možete dodati termin za vreme koje je već prošlo.');
        return;
      }
    }

    setSelectedSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSave = async () => {
    if (!selectedDate || selectedSlots.length === 0) {
      alert('Izaberite datum i barem jedan termin.');
      return;
    }

    try {
      await setDoc(doc(db, 'profesori', userId, 'slobodniTermini', selectedDate), {
        vreme: selectedSlots,
      });
      alert('Termini su sačuvani!');
      setSelectedDate(null);
      setSelectedSlots([]);
      setSavedSlots([]);
    } catch (err) {
      console.error(err);
      alert('Greška pri čuvanju termina.');
    }
  };

  const handleDelete = async () => {
    if (!selectedDate) return;
    await deleteDoc(doc(db, 'profesori', userId, 'slobodniTermini', selectedDate));
    alert('Termini za taj dan su obrisani.');
    setSelectedSlots([]);
    setSavedSlots([]);
  };

  const loadSavedSlots = async (date) => {
    const dateStr = formatDate(date);
    const ref = doc(db, 'profesori', userId, 'slobodniTermini', dateStr);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setSelectedSlots(data.vreme || []);
      setSavedSlots(data.vreme || []);
    } else {
      setSelectedSlots([]);
      setSavedSlots([]);
    }

    const q = query(
      collection(db, 'rezervacije'),
      where('profesorId', '==', userId),
      where('datum', '==', dateStr)
    );
    const bookedSnap = await getDocs(q);
    const booked = bookedSnap.docs.map((d) => d.data().vreme);
    setBookedSlots(booked);
  };

  const handleDateChange = async (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      alert('Ne možete dodavati termine za datume koji su prošli.');
      return;
    }

    if (
      selectedSlots.sort().join(',') !== savedSlots.sort().join(',') &&
      selectedSlots.length > 0
    ) {
      alert('Sačuvaj termine pre promene dana.');
      return;
    }

    const formatted = formatDate(date);
    setSelectedDate(formatted);
    if (userId) loadSavedSlots(date);
  };

  const handleBackToProfile = () => {
    if (selectedSlots.sort().join(',') !== savedSlots.sort().join(',') && selectedSlots.length > 0) {
      alert('Prvo sačuvaj termine pre nego što izađeš.');
      return;
    }
    navigate('/my-profile');
  };

  return (
    <div className="availability-container">
      <h1 className="availability-title">Dodaj slobodne termine</h1>
      <Calendar
        onClickDay={handleDateChange}
        value={selectedDate ? getDateWithoutTimezoneShift(selectedDate) : null}
        tileClassName={({ date }) =>
          selectedDate === formatDate(date) ? 'selected-day' : null
        }
        locale="sr-RS"
        tileDisabled={({ date }) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const check = new Date(date);
          check.setHours(0, 0, 0, 0);
          return check < today;
        }}
      />

      {selectedDate && (
        <>
          <h3 className="slots-title">Termini za {selectedDate}</h3>
          <div className="slots-grid">
            {timeSlots.map((time) => {
              const [h, m] = time.split(':').map(Number);
              const now = new Date();
              const slot = new Date();
              slot.setHours(h, m, 0, 0);
              const isPastToday = selectedDate === formatDate(new Date()) && slot <= now;

              return (
                <button
                  key={time}
                  onClick={() => toggleSlot(time)}
                  disabled={bookedSlots.includes(time) || isPastToday}
                  className={
                    bookedSlots.includes(time) || isPastToday
                      ? 'slot booked'
                      : selectedSlots.includes(time)
                      ? 'slot selected'
                      : 'slot'
                  }
                >
                  {time}
                </button>
              );
            })}
          </div>

          <div className="btn-row">
            <button onClick={handleSave} className="save-btn">
              Sačuvaj termine
            </button>
            <button onClick={handleDelete} className="delete-btn">
              Obriši sve za ovaj dan
            </button>
          </div>
        </>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
           <button
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
            fontFamily: 'PoppinsBold',
            marginTop: '10px'
          }}
          onClick={handleBackToProfile}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ← Nazad na profil
        </button>
      </div>
    </div>
  );
}