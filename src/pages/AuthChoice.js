import React from 'react';
import './AuthChoice.css';
import { useNavigate } from 'react-router-dom';

export default function AuthChoice() {
  const navigate = useNavigate();

  return (
    <div className="auth-choice-background">
      <div className="auth-choice-overlay">
        <h1 className="auth-title">Pristup za profesore</h1>
        <p className="auth-text">Izaberite opciju:</p>

        <button className="auth-button" onClick={() => navigate('/login')}>
          Prijavi se
        </button>

        <button className="auth-button outlined" onClick={() => navigate('/register')}>
          Registruj se
        </button>
      </div>
    </div>
  );
}
