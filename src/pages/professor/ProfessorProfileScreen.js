import React, { useEffect, useState } from 'react';
import './ProfessorProfileScreen.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc, getDoc, collection, getDocs, deleteDoc, setDoc, addDoc, query, where
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import ProfessorSchema from '../../components/ProfessorSchema';



export default function ProfessorProfileScreenWeb() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleBack = () => window.history.back();

  const [professor, setProfessor] = useState(null);
  const [slots, setSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [telefonUcenika, setTelefonUcenika] = useState('');
  const [ocena, setOcena] = useState('');
  const [komentar, setKomentar] = useState('');
  const [mozeOceniti, setMozeOceniti] = useState(false);
  const [oceneKomentari, setOceneKomentari] = useState([]);
  const [nacinCasa, setNacinCasa] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'profesori', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) setProfessor(snap.data());

      const terminiRef = collection(db, 'profesori', id, 'slobodniTermini');
      const terminiSnap = await getDocs(terminiRef);
      let svi = {};
      terminiSnap.forEach((d) => {
        svi[d.id] = d.data().vreme || [];
      });
      setSlots(svi);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const proveriPravo = async () => {
      if (!email) return;
      const q = query(
        collection(db, 'rezervacije'),
        where('profesorId', '==', id),
        where('email', '==', email)
      );
      const snapshot = await getDocs(q);
      setMozeOceniti(!snapshot.empty);
    };
    proveriPravo();
  }, [email]);

  useEffect(() => {
    const fetchKomentari = async () => {
      const snapshot = await getDocs(collection(db, 'profesori', id, 'oceneKomentari'));
      const lista = snapshot.docs.map(doc => doc.data());
      setOceneKomentari(lista);
    };
    fetchKomentari();
  }, [id]);

  const zakaziCas = async () => {
    if (!selectedSlot || !ime || !prezime || !email || !telefonUcenika || (professor.nacinCasova?.online && professor.nacinCasova?.uzivo && !nacinCasa)) {
      alert('Molimo popunite sva polja i izaberite termin i način izvođenja časa.');
      return;
    }

    const selectedDateTime = new Date(`${selectedSlot.dan}T${selectedSlot.vreme}`);
    if (selectedDateTime < new Date()) {
      alert('Ne možete zakazati čas u prošlosti.');
      return;
    }

    const finalMode = nacinCasa || (professor.nacinCasova?.online && !professor.nacinCasova?.uzivo ? 'online' : 'uzivo');
    const rezId = `${id}_${selectedSlot.dan}_${selectedSlot.vreme}`;

    let jitsiLink = '';
    if (finalMode === 'online') {
      const imeProfesora = professor.email.split('@')[0];
      const vremeBezDvotacke = selectedSlot.vreme.replace(':', '');
      jitsiLink = `https://meet.pronadjiprofesora.com/${imeProfesora}-${selectedSlot.dan}-${vremeBezDvotacke}`.replace(/\s+/g, '');
    }

    try {
      await setDoc(doc(db, 'rezervacije', rezId), {
        profesorId: id,
        datum: selectedSlot.dan,
        vreme: selectedSlot.vreme,
        ime,
        prezime,
        email,
        telefonUcenika,
        nacinCasa: finalMode,
        jitsiLink: finalMode === 'online' ? jitsiLink : '',
        ratingSent: false,
        status: 'zakazano' // ⬅⬅⬅ OVO DODAJEMO ZA OTKAZIVANJE
      });

      const terminRef = doc(db, 'profesori', id, 'slobodniTermini', selectedSlot.dan);
      const snap = await getDoc(terminRef);
      if (snap.exists()) {
        const updated = snap.data().vreme.filter((v) => v !== selectedSlot.vreme);
        if (updated.length > 0) {
          await setDoc(terminRef, { vreme: updated });
        } else {
          await deleteDoc(terminRef);
        }
      }

      if (!professor?.email) {
        alert('Profesor nema unet email.');
        return;
      }

      await fetch('https://email-api-jelenas-projects-7386403f.vercel.app/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ime,
          prezime,
          email,
          datum: selectedSlot.dan,
          vreme: selectedSlot.vreme,
          telefonUcenika,
          profesorEmail: professor.email,
          nacinCasa: finalMode,
          jitsiLink,
          tip: 'zakazivanje',
          profesorId: id // ⬅⬅⬅ NEOPHODNO ZA GENERISANJE cancel LINKA
        }),
      });

      alert('Rezervacija uspešna! Email poslat.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Došlo je do greške.');
    }
  };

  const posaljiKomentar = async () => {
    if (!ocena || !komentar || !email) {
      alert('Unesite i ocenu i komentar.');
      return;
    }

    const q = query(collection(db, 'profesori', id, 'oceneKomentari'), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert('Već ste ocenili ovog profesora.');
      return;
    }

    await addDoc(collection(db, 'profesori', id, 'oceneKomentari'), {
      email,
      komentar,
      ocena: parseInt(ocena),
      timestamp: new Date(),
    });
    alert('Hvala na komentaru!');
    setKomentar('');
    setOcena('');
  };

  return (
    <div className="professor-profile">
      {!professor ? (
        <p className="loading">Učitavanje...</p>
      ) : (
        <>
<ProfessorSchema
  professor={{
    id,
    ime: professor.ime,
    predmeti: Object.entries(professor.predmeti || {}).filter(([, v]) => v).map(([k]) => k),
    nivoObrazovanja: Object.entries(professor.nivoi || {}).filter(([, v]) => v).map(([k]) => k),
    grad: (() => {
      const gradovi = Object.keys(professor.gradovi || {});
      if (gradovi.includes('Beograd') && professor.opstine) {
        const izabraneOpstine = Object.entries(professor.opstine)
          .filter(([, v]) => v)
          .map(([k]) => `Beograd - ${k}`);
        if (izabraneOpstine.length > 0) return izabraneOpstine.join(', ');
      }
      return gradovi[0] || 'Nepoznat grad';
    })(),
    cena: professor.cena || '',
    prosecnaOcena: oceneKomentari.length
      ? (oceneKomentari.reduce((s, x) => s + x.ocena, 0) / oceneKomentari.length).toFixed(2)
      : undefined,
    brojKomentara: oceneKomentari.length || undefined,
    nacinCasova: professor.nacinCasova || {}
  }}
/>


          <h1>{professor.ime}</h1>
          <p className="info">📚 {Object.entries(professor.predmeti || {}).filter(([, v]) => v).map(([k]) => k).join(', ')}</p>
          <p className="info">🎓 {Object.entries(professor.nivoi || {}).filter(([, v]) => v).map(([k]) => k).join(', ')}</p>
          <p className="info">📍 {
            Object.keys(professor.gradovi || {}).map((grad) => {
              if (grad === 'Beograd' && professor.opstine) {
                const izabraneOpstine = Object.keys(professor.opstine).filter(op => professor.opstine[op]);
                if (izabraneOpstine.length > 0) {
                  return izabraneOpstine.map(op => `Beograd - ${op}`).join(', ');
                }
              }
              return grad;
            }).join(', ')
          }</p>
          <p className="info">💰 {professor.cena ? `${professor.cena} RSD` : 'Nije navedena'}</p>
          {oceneKomentari.length > 0 && (
  <p className="info">⭐ Prosečna ocena: {
    (oceneKomentari.reduce((sum, item) => sum + item.ocena, 0) / oceneKomentari.length).toFixed(2)
  }</p>
)}

          <div className="info">
            {professor.nacinCasova?.uzivo && <span className="badge-uzivo">🏠 Uživo</span>}
            {professor.nacinCasova?.online && <span className="badge-online">💻 Online</span>}
          </div>

          {professor.opis && (
            <>
              <h2>🧾 O profesoru</h2>
              <p className="info">{professor.opis}</p>
            </>
          )}

          <h2>📅 Dostupni termini</h2>
          <Calendar
            onClickDay={(value) => {
              const localDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().split('T')[0];
              setSelectedDate(localDate);
            }}
            minDate={new Date()}
            tileDisabled={({ date }) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            tileClassName={({ date }) => {
              const key = date.toLocaleDateString('sv-SE');
              return slots[key] ? 'highlighted-day' : null;
            }}
          />

          {selectedDate && (
            <div className="slot-list">
              {slots[selectedDate]?.length > 0 ? (
                slots[selectedDate].map((vreme, i) => {
                  const [h, m] = vreme.split(':').map(Number);
                  const datumIVreme = new Date(selectedDate);
                  datumIVreme.setHours(h, m, 0, 0);
                  const isPast = datumIVreme < new Date();
                  return (
                    <button
                      key={i}
                      className={`slot ${selectedSlot?.dan === selectedDate && selectedSlot?.vreme === vreme ? 'selected' : ''}`}
                      onClick={() => !isPast && setSelectedSlot({ dan: selectedDate, vreme })}
                      disabled={isPast}
                      style={isPast ? { backgroundColor: '#333', color: '#999', cursor: 'not-allowed' } : {}}
                    >
                      {vreme}
                    </button>
                  );
                })
              ) : (
                <p className="info">Nema slobodnih termina za ovaj dan.</p>
              )}
            </div>
          )}

          <input type="text" placeholder="Ime" value={ime} onChange={e => setIme(e.target.value)} />
          <input type="text" placeholder="Prezime" value={prezime} onChange={e => setPrezime(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="tel" placeholder="Telefon" value={telefonUcenika} onChange={e => setTelefonUcenika(e.target.value)} />

          {professor.nacinCasova?.online && professor.nacinCasova?.uzivo && (
            <div className="select-nacin">
              <label>Način izvođenja časa:</label>
              <select value={nacinCasa} onChange={(e) => setNacinCasa(e.target.value)}>
                <option value="">-- Izaberite --</option>
                <option value="uzivo">Uživo</option>
                <option value="online">Online</option>
              </select>
            </div>
          )}

          <div className="button-wrapper">
            <button className="zakazi-button" onClick={zakaziCas}>Zakaži čas</button>
            <button className="back-button" onClick={handleBack}>⟵ Nazad</button>
          </div>

        <h2>📝 Komentari i ocene</h2>

{oceneKomentari.length > 0 ? (
  <>

    {oceneKomentari.map((item, idx) => (
      <div key={idx} className="komentar-item">
        <p><strong>⭐ Ocena:</strong> {item.ocena}</p>
        <p><strong>💬 Komentar:</strong> {item.komentar}</p>
      </div>
    ))}
  </>
) : (
  <p className="info">Još nema komentara za ovog profesora.</p>
)}

        </>
      )}
    </div>
  );
}
