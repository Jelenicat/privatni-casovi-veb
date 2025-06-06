import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  setDoc,
  collection
} from 'firebase/firestore';
import './[id].css';

export default function CancelReservation() {
  const { id } = useParams();
  const [status, setStatus] = useState('Učitavanje...');

  useEffect(() => {
    const cancelClass = async () => {
      try {
        const rezervacijaRef = doc(db, 'rezervacije', id);
        const rezervacijaSnap = await getDoc(rezervacijaRef);

        if (!rezervacijaSnap.exists()) {
          setStatus('Rezervacija nije pronađena.');
          return;
        }

        const data = rezervacijaSnap.data();
        if (data.status === 'otkazano') {
          setStatus('Čas je već otkazan.');
          return;
        }

        const rezervacijaVreme = new Date(`${data.datum}T${data.vreme}`);
        const sada = new Date();

        if (rezervacijaVreme < sada) {
          setStatus('Ne možete otkazati čas u prošlosti.');
          return;
        }

        // Vrati termin profesoru
        const terminRef = doc(db, 'profesori', data.profesorId, 'slobodniTermini', data.datum);
        const terminSnap = await getDoc(terminRef);
        if (terminSnap.exists()) {
          const prethodna = terminSnap.data().vreme || [];
          if (!prethodna.includes(data.vreme)) {
            await updateDoc(terminRef, {
              vreme: [...prethodna, data.vreme].sort()
            });
          }
        } else {
          await setDoc(terminRef, { vreme: [data.vreme] });
        }

        // Obeleži čas kao otkazan
        await updateDoc(rezervacijaRef, { status: 'otkazano' });

        // Dohvati profesorov email
        const profSnap = await getDoc(doc(db, 'profesori', data.profesorId));
        const profesorData = profSnap.exists() ? profSnap.data() : null;

        if (profesorData?.email) {
          await fetch('https://email-api-jelenas-projects-7386403f.vercel.app/api/sendEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tip: 'otkazivanje',
              ime: data.ime,
              prezime: data.prezime,
              datum: data.datum,
              vreme: data.vreme,
              profesorEmail: profesorData.email,
              nacinCasa: data.nacinCasa || '',
               email: profesorData.email
            }),
          });
        }

        setStatus('Uspešno ste otkazali čas. Hvala što ste obavestili profesora.');
      } catch (error) {
        console.error(error);
        setStatus('Greška prilikom otkazivanja. Pokušajte ponovo kasnije.');
      }
    };

    cancelClass();
  }, [id]);

  return (
    <div className="cancel-container">
      <div className="cancel-box">
        <h1>{status}</h1>
      </div>
    </div>
  );
}
