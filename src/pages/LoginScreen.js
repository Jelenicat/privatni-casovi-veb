import React, { useState } from 'react';
import './LoginScreen.css';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Unesite email i lozinku.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Ulogovani ste kao profesor');
      navigate('/my-profile');
    } catch (error) {
      alert('Neispravan email ili lozinka');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Prijava profesora</h1>

      <input
        type="email"
        className="login-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          className="login-input"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => setShowPassword(!showPassword)} className="eye-button">
          {showPassword ? '🚫' : '👁'}
        </button>
      </div>

      <button className="login-button" onClick={handleLogin}>
        Prijavi se
      </button>

      <p className="login-link">
        Nemate nalog?{' '}
        <span className="login-link-highlight" onClick={() => navigate('/register')}>
          Registrujte se
        </span>
      </p>
    </div>
  );
}
