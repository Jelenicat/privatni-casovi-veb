import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import './Register.css';
import bg8 from '../assets/bg8.jpg';


export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!email || !password || !confirmPassword) {
      setError('Molimo popunite sva polja.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'profesori', user.uid), {
        ime: '',
        grad: '',
        trajanjeCasa: '45',
        email: user.email,
        predmeti: {
          Matematika: false,
          Fizika: false,
          Hemija: false,
          Engleski: false,
        },
        nivoi: {
          'Osnovna škola': false,
          'Srednja škola': false,
          Fakultet: false,
        },
      });

      navigate('/edit-profile', { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

return (
  <div className="register-background" style={{ backgroundImage: `url(${bg8})` }}>
    <div className="register-overlay">
      <div className="register-container">
        <h1>Registracija profesora</h1>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Potvrdi lozinku"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Registruj se</button>
        <button className="register-back-button" onClick={() => window.history.back()}>
          ⟵ Nazad
        </button>
      </div>
    </div>
  </div>
);

}
