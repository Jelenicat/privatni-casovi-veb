import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './RateProfessor.css';

export default function RateProfessor() {
  const { rezervacijaId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [rezervacija, setRezervacija] = useState(null);
  const [ocena, setOcena] = useState('');
  const [komentar, setKomentar] = useState('');
  const [poruka, setPoruka] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const docRef = doc(db, 'rezervacije', rezervacijaId);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        setPoruka('Rezervacija ne postoji.');
        setLoading(false);
        return;
      }

      const data = snap.data();

      if (data.ocena) {
        setPoruka('Već ste ocenili profesora. Hvala!');
        setLoading(false);
        return;
      }

      setRezervacija(data);
      setLoading(false);
    };

    fetch();
  }, [rezervacijaId]);

  const handleSubmit = async () => {
    if (!ocena || ocena < 1 || ocena > 5) {
      alert('Unesite ocenu između 1 i 5.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'rezervacije', rezervacijaId),
        { ocena: parseInt(ocena), komentar },
        { merge: true }
      );

      await setDoc(
        doc(db, 'profesori', rezervacija.profesorId, 'oceneKomentari', rezervacijaId),
        {
          ocena: parseInt(ocena),
          komentar,
          email: rezervacija.email,
          timestamp: new Date(),
        }
      );

      setPoruka('Hvala na oceni! Bićete uskoro preusmereni.');
      setTimeout(() => navigate('/'), 5000);
    } catch (err) {
      console.error(err);
      setPoruka('Greška prilikom slanja.');
    }
  };

  if (loading) return <p className="rate-message">Učitavanje...</p>;
  if (poruka) return <p className="rate-message">{poruka}</p>;

  return (
    <div className="rate-container">
      <h2>Ocenite profesora</h2>
      <label>Ocena (1-5):</label>
      <input
        type="number"
        min="1"
        max="5"
        value={ocena}
        onChange={(e) => setOcena(e.target.value)}
      />
      <label>Komentar (opciono):</label>
      <textarea
        value={komentar}
        onChange={(e) => setKomentar(e.target.value)}
      />
      <button onClick={handleSubmit}>Pošalji ocenu</button>
    </div>
  );
}
