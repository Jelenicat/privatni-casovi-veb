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
  const mode = queryParams.get('mode') || 'oba';

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
      const s = subjects;

      snap.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;

        const nivoMatch = data.nivoi?.[levelFromParam] === true;
        const predmetMatch = Object.keys(s).some((k) => s[k] && data.predmeti?.[k]);

        const offersOnline = data.nacinCasova?.online;
        const offersUzivo = data.nacinCasova?.uzivo;

        const passedLocationCheck = (() => {
          if (!locationParam) return false;
          if (grad && opstina) {
            return data.gradovi?.[grad] && data.opstine?.[opstina];
          } else if (grad) {
            return data.gradovi?.[grad];
          }
          return false;
        })();

        let include = false;

        if (mode === 'online') {
          include = offersOnline;
        } else if (mode === 'uzivo') {
          include = offersUzivo && passedLocationCheck;
        } else if (mode === 'oba') {
          include = (offersOnline || (offersUzivo && passedLocationCheck));
        }

        if (nivoMatch && predmetMatch && include) {
          lista.push({ id, ...data });
        }
      });

      setProfesori(lista);
    };

    fetch();
  }, [levelFromParam, locationParam, subjects, mode]);

  return (
    <div className="results-container">
      <h1 className="results-title">Rezultati pretrage</h1>

      {profesori.length === 0 ? (
        <p className="no-results">Nema dostupnih profesora za izabrane kriterijume.</p>
      ) : (
        profesori.map((prof) => (
          <div key={prof.id} className="card" onClick={() => navigate(`/professor/${prof.id}`)}>
            <div className="badges">
              {prof.nacinCasova?.online && <div className="badge badge-online">ONLINE</div>}
              {prof.nacinCasova?.uzivo && <div className="badge badge-uzivo">UŽIVO</div>}
            </div>

            <h2 className="prof-name">{prof.ime || 'Nepoznat profesor'}</h2>

            {prof.opis && (
              <p className="prof-opis">
                {prof.opis.length > 100 ? prof.opis.slice(0, 100) + '...' : prof.opis}
              </p>
            )}

            <p className="prof-info">
              📍 {Object.keys(prof.gradovi || {}).map((grad) => {
                if (grad === 'Beograd' && prof.opstine) {
                  const izabraneOpstine = Object.keys(prof.opstine).filter(op => prof.opstine[op]);
                  if (izabraneOpstine.length > 0) {
                    return izabraneOpstine.map(op => `Beograd - ${op}`).join(', ');
                  }
                }
                return grad;
              }).join(', ')}
            </p>

            <p className="prof-info">
              📚 {Object.keys(prof.predmeti || {}).filter((p) => prof.predmeti[p]).join(', ')}
            </p>

            <p className="prof-info">
              🎓 {Object.keys(prof.nivoi || {}).filter((n) => prof.nivoi[n]).join(', ')}
            </p>

            <p className="prof-info">
              {prof.nacinCasova?.uzivo ? '🏠 Uživo ' : ''}
              {prof.nacinCasova?.online ? '💻 Online' : ''}
            </p>

            <p className="prof-price">
              💰 {prof.cena ? `${prof.cena} RSD po času` : 'Cena nije navedena'}
            </p>
          </div>
        ))
      )}

      <div className="back-button-container">
        <button className="back-button" onClick={handleBack}>⟵ Nazad</button>
      </div>
    </div>
  );
}
