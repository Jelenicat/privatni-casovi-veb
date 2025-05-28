import React from 'react';
import './SelectMode.css';
import { useNavigate } from 'react-router-dom';
import bg7 from '../assets/bg7.jpg';

export default function SelectMode() {
  const navigate = useNavigate();

  const handleSelect = (mode) => {
    localStorage.setItem('mode', mode);
    navigate('/education');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="mode-background" style={{ backgroundImage: `url(${bg7})` }}>
      <div className="mode-overlay">
        <div className="mode-container">
          <h1>Kako želiš da se čas odvija?</h1>
          <button onClick={() => handleSelect('uzivo')}>Uživo</button>
          <button onClick={() => handleSelect('online')}>Online</button>
          <button onClick={() => handleSelect('oba')}>Svejedno (oba)</button>
          <button className="back-button" onClick={handleBack}>⟵ Nazad</button>
        </div>
      </div>
    </div>
  );
}
