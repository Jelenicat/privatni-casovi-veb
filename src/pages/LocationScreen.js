import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './LocationScreen.css';
import bg5 from '../assets/bg5.jpg';
import { SVI_GRADOVI_SRBIJE, OPSTINE_BEOGRADA } from '../constants/serbianCities';


const opstineBeograd = [
  'Novi Beograd', 'Zemun', 'Zvezdara', 'Vračar', 'Voždovac',
  'Palilula', 'Rakovica', 'Savski venac', 'Stari grad', 'Čukarica'
];

export default function LocationScreen({ navigate }) {
  const [selectedGrad, setSelectedGrad] = useState('');
  const [selectedOpstina, setSelectedOpstina] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get('level');

  const handleNext = () => {
    const lokacija = selectedGrad === 'Beograd'
      ? `${selectedGrad} - ${selectedOpstina}`
      : selectedGrad;

    navigate(`/subjects?level=${level}&location=${encodeURIComponent(lokacija)}`);
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
      

        <h1 className="title">Izaberi grad</h1>
        <select
          value={selectedGrad}
          onChange={(e) => {
            setSelectedGrad(e.target.value);
            setSelectedOpstina(''); // resetuj opštinu ako promeni grad
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
              <option value="">-- Odaberi opštinu --</option>
              {opstineBeograd.map((opstina) => (
                <option key={opstina} value={opstina}>{opstina}</option>
              ))}
            </select>
          </>
        )}

        <button
          className="location-button"
          disabled={!selectedGrad || (selectedGrad === 'Beograd' && !selectedOpstina)}
          onClick={handleNext}
        >
          Nastavi
        </button>
         <button className="back-button" onClick={handleBack}>⟵ Nazad</button>
      </div>
    </div>
  );
}
