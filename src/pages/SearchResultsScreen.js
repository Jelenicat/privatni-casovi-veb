import React, { useEffect, useState } from 'react';
import './SearchResultsScreen.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function SearchResultsScreen() {
  const [profesori, setProfesori] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const handleBack = () => {
  window.history.back();
};
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get('level');
  const locationParam = queryParams.get('location');
  const subjects = JSON.parse(queryParams.get('subjects') || '{}');

  // Mapiranje "friendly" vrednosti u one koje koristi Firestore
  const LEVEL_MAP = {
    osnovna: 'Osnovna škola',
    srednja: 'Srednja škola',
    fakultet: 'Fakultet',
  };

  const levelFromParam = LEVEL_MAP[level] || level;

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'profesori'));
      const lista = [];

      const [grad, opstina] = locationParam?.split(' - ') || [];
      const g = grad ? { [grad]: true } : {};
      const o = opstina ? { [opstina]: true } : {};
      const s = subjects;

      snap.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;

        const nivoMatch = data.nivoi?.[levelFromParam] === true;
        const gradMatch = Object.keys(g).some((k) => g[k] && data.gradovi?.[k]);
        const opstinaMatch = Object.keys(o).some((k) => o[k] && data.opstine?.[k]);
        const predmetMatch = Object.keys(s).some((k) => s[k] && data.predmeti?.[k]);

        if (nivoMatch && (gradMatch || opstinaMatch) && predmetMatch) {
          lista.push({ id, ...data });
        }
      });

      setProfesori(lista);
    };

    fetch();
  }, [levelFromParam, locationParam, subjects]);

  return (
    <div className="results-container">
      <h1 className="results-title">Rezultati pretrage</h1>
      <button className="back-button" onClick={handleBack}>⟵ Nazad</button>

      {profesori.length === 0 ? (
        <p className="no-results">Nema dostupnih profesora za izabrane kriterijume.</p>
      ) : (
        profesori.map((prof) => (
          <div key={prof.id} className="card" onClick={() => navigate(`/professor/${prof.id}`)}>
            <h2 className="prof-name">{prof.ime || 'Nepoznat profesor'}</h2>
            {prof.opis && (
              <p className="prof-opis">
                {prof.opis.length > 100 ? prof.opis.slice(0, 100) + '...' : prof.opis}
              </p>
            )}
            <p className="prof-info">
              📍 {Object.keys(prof.gradovi || {}).filter((g) => prof.gradovi[g]).join(', ')}
            </p>
            <p className="prof-info">
              📚 {Object.keys(prof.predmeti || {}).filter((p) => prof.predmeti[p]).join(', ')}
            </p>
            <p className="prof-info">
              🎓 {Object.keys(prof.nivoi || {}).filter((n) => prof.nivoi[n]).join(', ')}
            </p>
            <p className="prof-price">
              💰 {prof.cena ? `${prof.cena} RSD po času` : 'Cena nije navedena'}
            </p>
          </div>
          
        ))
      )}
    </div>
  );
}
