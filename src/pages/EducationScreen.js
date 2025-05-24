import React from 'react';
import './EducationScreen.css';
import bg1 from '../assets/bg1.jpg';

export default function EducationScreen({ navigate }) {
  return (
    <div className="education-background" style={{ backgroundImage: `url(${bg1})` }}>
      <div className="education-overlay">
        <h1 className="education-title">Izaberi nivo obrazovanja</h1>
        <div className="button-group">
          <button onClick={() => navigate('/location?level=osnovna')}>Osnovna škola</button>
          <button onClick={() => navigate('/location?level=srednja')}>Srednja škola</button>
          <button onClick={() => navigate('/location?level=fakultet')}>Fakultet</button>
        </div>
      </div>
    </div>
  );
}
