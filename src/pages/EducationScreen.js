import React from 'react';
import './EducationScreen.css';
import bg1 from '../assets/bg1.jpg';

export default function EducationScreen({ navigate }) {
  const handleBack = () => {
    window.history.back();
  };
const selectedMode = localStorage.getItem('mode') || 'oba';

  return (
    <div className="education-background" style={{ backgroundImage: `url(${bg1})` }}>
      <div className="education-overlay">
        <h1 className="education-title">Izaberi nivo obrazovanja</h1>
        <div className="button-group">
          <button onClick={() => navigate(`/location?level=osnovna&mode=${selectedMode}`)}>Osnovna škola</button>
          <button onClick={() => navigate(`/location?level=srednja&mode=${selectedMode}`)}>Srednja škola</button>
          <button onClick={() => navigate(`/location?level=fakultet&mode=${selectedMode}`)}>Fakultet</button>

        </div>
        <button className="back-button" onClick={handleBack}>⟵ Nazad</button>
      </div>
    </div>
  );
}
