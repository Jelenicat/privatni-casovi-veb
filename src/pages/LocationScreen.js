import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './LocationScreen.css';
import bg5 from '../assets/bg5.jpg';
import { SVI_GRADOVI_SRBIJE, OPSTINE_BEOGRADA } from '../constants/serbianCities';

export default function LocationScreen({ navigate }) {
  const [selectedGrad, setSelectedGrad] = useState('');
  const [selectedOpstina, setSelectedOpstina] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get('level');
  const mode = queryParams.get('mode') || 'oba';


  const handleNext = () => {
    const lokacija = selectedGrad === 'Beograd'
      ? selectedOpstina
        ? `${selectedGrad} - ${selectedOpstina}`
        : selectedGrad // sve opštine
      : selectedGrad;

    navigate(`/subjects?level=${level}&location=${encodeURIComponent(lokacija)}&mode=${mode}`);

  };

  const handleBack = () => {
    window.history.back();
  };

  const gradovi = [
    'Beograd',
    ...SVI_GRADOVI_SRBIJE.filter(g => g !== 'Beograd').sort()
  ];

return (
  <div className="location-background" style={{ backgroundImage: `url(${bg5})` }}>
    <div className="location-overlay">
      <h1 className="title">
        {mode === 'online' ? 'Online čas' : 'Izaberi grad za uživo čas'}
      </h1>

      {/* Prikaz izbora grada/opštine samo ako nije "online" */}
      {mode !== 'online' && (
        <>
          <select
            value={selectedGrad}
            onChange={(e) => {
              setSelectedGrad(e.target.value);
              setSelectedOpstina('');
            }}
          >
            <option value="">-- Odaberi grad --</option>
            {gradovi.map((grad) => (
              <option key={grad} value={grad}>{grad}</option>
            ))}
          </select>

          {selectedGrad === 'Beograd' && (
            <>
              <h2 className="subtitle">Izaberi opštinu</h2>
              <select value={selectedOpstina} onChange={(e) => setSelectedOpstina(e.target.value)}>
                <option value="">-- Sve opštine --</option>
                {OPSTINE_BEOGRADA.map((opstina) => (
                  <option key={opstina} value={opstina}>{opstina}</option>
                ))}
              </select>
            </>
          )}
        </>
      )}

      <button
        className="location-button"
        disabled={mode !== 'online' && !selectedGrad}
        onClick={handleNext}
      >
        Nastavi
      </button>

      <button className="back-button" onClick={handleBack}>⟵ Nazad</button>
    </div>
  </div>
);

}
