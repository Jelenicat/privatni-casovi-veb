import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SubjectsScreen.css';
import bg6 from '../assets/bg6.jpg';

const KATEGORIJE_PREDMETA = {
  'Jezici': ['Engleski', 'Nemački', 'Francuski', 'Srpski jezik', 'Italijanski', 'Španski', 'Ruski', 'Kineski', 'Japanski', 'Latinski', 'Grčki'],
  'Prirodne nauke': ['Matematika', 'Matematika 2', 'Fizika', 'Fizika 2', 'Hemija', 'Biologija', 'Statistika', 'Astronomija', 'Geologija'],
  'Računari i tehnologija': ['Informatika', 'Programiranje', 'Računarske mreže', 'Elektrotehnika', 'Algoritmi', 'Baze podataka', 'Veštačka inteligencija', 'Kompjuterska grafika', 'Bezbednost informacionih sistema'],
  'Društvene nauke': ['Istorija', 'Geografija', 'Psihologija', 'Sociologija', 'Filozofija', 'Logika', 'Antropologija', 'Politika', 'Etika'],
  'Ekonomija i pravo': ['Pravo', 'Ekonomija', 'Menadžment', 'Marketing', 'Računovodstvo', 'Finansije', 'Preduzetništvo', 'Poreski sistem', 'Bankarstvo'],
  'Ostalo': ['Likovno', 'Likovna kultura', 'Muzika', 'Mašinstvo', 'Hemijsko inženjerstvo', 'Biotehnologija', 'Medicinska hemija', 'Farmakologija', 'Statistika za psihologe', 'Sport i fizičko', 'Zdravstvena nega', 'Pedagogija']
};

export default function SubjectsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get('level');
  const loc = queryParams.get('location');

  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => ({ ...prev, [subject]: !prev[subject] }));
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleSearch = () => {
    const query = new URLSearchParams({
      level,
      location: loc,
      subjects: JSON.stringify(selectedSubjects),
    }).toString();

    navigate(`/search-results?${query}`);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="subjects-background" style={{ backgroundImage: `url(${bg6})` }}>
      <div className="subjects-overlay">
        <h1>Izaberi predmete</h1>

        {Object.entries(KATEGORIJE_PREDMETA).map(([group, subjects]) => (
          <div key={group} className="subject-group">
            <div className="group-header" onClick={() => toggleGroup(group)}>
              {expandedGroups[group] ? '▼' : '►'} {group}
            </div>
            {expandedGroups[group] && subjects.map((subj) => (
              <label key={subj} className="subject-item">
                <input
                  type="checkbox"
                  checked={selectedSubjects[subj] || false}
                  onChange={() => toggleSubject(subj)}
                />
                <span>{subj}</span>
              </label>
            ))}
          </div>
        ))}

        <div className="button-group">
          <button
            onClick={handleSearch}
            disabled={Object.keys(selectedSubjects).length === 0}
            className="search-button"
          >
            Pretraži profesore
          </button>
          <button className="back-button" onClick={handleBack}>
            ⟵ Nazad
          </button>
        </div>
      </div>
    </div>
  );
}
