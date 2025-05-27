import React, { useEffect, useState, useRef } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import { SVI_GRADOVI_SRBIJE, OPSTINE_BEOGRADA } from '../constants/serbianCities';

const KATEGORIJE_PREDMETA = {
  'Jezici': ['Engleski', 'Nemački', 'Francuski', 'Srpski jezik', 'Italijanski', 'Španski'],
  'Prirodne nauke': ['Matematika', 'Fizika', 'Hemija', 'Biologija'],
  'Računari': ['Informatika', 'Programiranje', 'Računarske mreže'],
  'Društvene nauke': ['Istorija', 'Geografija', 'Psihologija', 'Sociologija'],
  'Ekonomija i pravo': ['Ekonomija', 'Pravo', 'Menadžment'],
};

export default function EditProfile() {
  const [ime, setIme] = useState('');
  const [opis, setOpis] = useState('');
  const [trajanjeCasa, setTrajanjeCasa] = useState('45');
  const [gradovi, setGradovi] = useState({});
  const [opstine, setOpstine] = useState({});
  const [showGradoviDropdown, setShowGradoviDropdown] = useState(false);
  const [showOpstineDropdown, setShowOpstineDropdown] = useState(false);
  const [cena, setCena] = useState('');
  const [email, setEmail] = useState('');
  const [nivoi, setNivoi] = useState({
    'Osnovna škola': false,
    'Srednja škola': false,
    'Fakultet': false,
  });
  const [predmeti, setPredmeti] = useState({});
  const [expanded, setExpanded] = useState({});
  const [isModified, setIsModified] = useState(false);

  const gradDropdownRef = useRef();
  const opstinaDropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'profesori', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIme(data.ime || '');
          setOpis(data.opis || '');
          setTrajanjeCasa(data.trajanjeCasa || '45');
          setGradovi(data.gradovi || {});
          setOpstine(data.opstine || {});
          setCena(data.cena ? data.cena.toString() : '');
          setEmail(data.email || user.email);
          setNivoi(data.nivoi || {});
          setPredmeti(data.predmeti || {});
        }
      }
    };
    fetchProfile();

    const handleClickOutside = (event) => {
      if (gradDropdownRef.current && !gradDropdownRef.current.contains(event.target)) {
        setShowGradoviDropdown(false);
      }
      if (opstinaDropdownRef.current && !opstinaDropdownRef.current.contains(event.target)) {
        setShowOpstineDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCheckbox = (stateSetter, state, key) => {
    const newState = { ...state, [key]: !state[key] };
    if (!newState[key]) delete newState[key];
    stateSetter(newState);
    setIsModified(true);
  };

  const toggleGroup = (group) => {
    setExpanded((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const finalOpstine = gradovi['Beograd'] ? opstine : {};

    await updateDoc(doc(db, 'profesori', user.uid), {
      ime,
      opis,
      trajanjeCasa,
      gradovi,
      opstine: finalOpstine,
      cena: parseInt(cena),
      email,
      nivoi,
      predmeti,
    });
    alert('Profil uspešno sačuvan!');
    setIsModified(false);
    navigate('/my-profile');
  };

  const handleBack = () => {
    if (isModified) {
      alert('Molimo prvo sačuvajte izmene pre nego što se vratite nazad.');
      return;
    }
    navigate(-1);
  };

  return (
    <div className="edit-container">
      <h1 className="edit-title">Izmeni profil</h1>

      <label>Ime:</label>
      <input value={ime} onChange={(e) => { setIme(e.target.value); setIsModified(true); }} />

      <label>O meni:</label>
      <textarea value={opis} onChange={(e) => { setOpis(e.target.value); setIsModified(true); }} rows={4} />

      <label>Trajanje časa:</label>
      <div className="duration-buttons">
        <button onClick={() => { setTrajanjeCasa('45'); setIsModified(true); }} className={trajanjeCasa === '45' ? 'active' : ''}>45 min</button>
        <button onClick={() => { setTrajanjeCasa('60'); setIsModified(true); }} className={trajanjeCasa === '60' ? 'active' : ''}>60 min</button>
      </div>

      <label>Cena časa (RSD):</label>
      <input value={cena} onChange={(e) => { setCena(e.target.value.replace(/[^0-9]/g, '')); setIsModified(true); }} />

      <label>Email (ne menja se):</label>
      <input value={email} disabled />

      <div className="dropdown-section" ref={gradDropdownRef}>
        <label onClick={() => setShowGradoviDropdown(!showGradoviDropdown)} className="dropdown-toggle">
          Gradovi ▾
        </label>
        {showGradoviDropdown && (
          <div className="checkbox-dropdown">
            {SVI_GRADOVI_SRBIJE.map((grad) => (
              <label key={grad} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={gradovi[grad] || false}
                  onChange={() => toggleCheckbox(setGradovi, gradovi, grad)}
                />
                <span>{grad}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {gradovi['Beograd'] && (
        <div className="dropdown-section" ref={opstinaDropdownRef}>
          <label onClick={() => setShowOpstineDropdown(!showOpstineDropdown)} className="dropdown-toggle">
            Opštine Beograda ▾
          </label>
          {showOpstineDropdown && (
            <div className="checkbox-dropdown">
              {OPSTINE_BEOGRADA.map((opstina) => (
                <label key={opstina} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={opstine[opstina] || false}
                    onChange={() => toggleCheckbox(setOpstine, opstine, opstina)}
                  />
                  <span>{opstina}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <label>Predmeti:</label>
      {Object.entries(KATEGORIJE_PREDMETA).map(([kategorija, lista]) => (
        <div key={kategorija} className="category-section">
          <button type="button" className="category-title" onClick={() => toggleGroup(kategorija)}>
            {expanded[kategorija] ? '▼' : '►'} {kategorija}
          </button>
          {expanded[kategorija] && (
            <div className="subject-list">
              {lista.map((predmet) => (
                <label key={predmet} className="subject-item">
                  <input
                    type="checkbox"
                    checked={predmeti[predmet] || false}
                    onChange={() => toggleCheckbox(setPredmeti, predmeti, predmet)}
                  />
                  {predmet}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <label>Nivoi obrazovanja:</label>
      <div className="subject-list">
        {Object.keys(nivoi).map((nivo) => (
          <div key={nivo} className="subject-item">
            <input
              type="checkbox"
              checked={nivoi[nivo] || false}
              onChange={() => {
                const updated = { ...nivoi, [nivo]: !nivoi[nivo] };
                setNivoi(updated);
                setIsModified(true);
              }}
            />
            <span>{nivo}</span>
          </div>
        ))}
      </div>

      <button className="save-button" onClick={handleSave}>Sačuvaj</button>
      <button className="back-button" onClick={handleBack}>⟵ Nazad</button>

    </div>
  );
}
