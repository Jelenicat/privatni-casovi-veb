// src/components/KontaktForma.js
import React, { useState } from 'react';
import './KontaktForma.css';

export default function KontaktForma() {
  const [ime, setIme] = useState('');
  const [email, setEmail] = useState('');
  const [poruka, setPoruka] = useState('');
  const [uspeh, setUspeh] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://email-api-vercel-app.vercel.app/api/sendEmail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ime, email, poruka, tip: 'kontakt-forma' }),
})


    if (res.ok) {
      setUspeh(true);
      setIme('');
      setEmail('');
      setPoruka('');
    } else {
      setUspeh(false);
    }
  };

  return (
    <form className="kontakt-forma" onSubmit={handleSubmit}>
      <h2>Kontaktiraj nas</h2>
      <input
        type="text"
        placeholder="Ime"
        value={ime}
        onChange={(e) => setIme(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <textarea
        placeholder="Poruka"
        value={poruka}
        onChange={(e) => setPoruka(e.target.value)}
        required
      />
      <button type="submit">Pošalji</button>
      {uspeh === true && <p className="uspeh">Poruka uspešno poslata!</p>}
      {uspeh === false && <p className="greska">Greška pri slanju. Pokušajte ponovo.</p>}
    </form>
  );
}
