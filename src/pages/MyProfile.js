import React, { useEffect, useState } from 'react';
import './MyProfile.css';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
      } else {
        const ref = doc(db, 'profesori', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        }
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return <div className="profile-container">Učitavanje...</div>;

  if (!profile) return <div className="profile-container">Nema podataka o profilu.</div>;

  return (
    <div className="profile-container">
      <h1>Moj profil</h1>

      <div className="info-section">
        <p><strong>Ime:</strong> {profile.ime}</p>
        {profile.opis && (
          <>
            <h3 className="highlight">O meni:</h3>
            <p>{profile.opis}</p>
          </>
        )}
        <p><strong>Email:</strong> {auth.currentUser.email}</p>
        <p><strong>Grad:</strong> {Object.keys(profile.gradovi || {}).filter(k => profile.gradovi[k]).join(', ')}</p>
        <p><strong>Opštine:</strong> {Object.keys(profile.opstine || {}).filter(k => profile.opstine[k]).join(', ')}</p>
        <p><strong>Trajanje časa:</strong> {profile.trajanjeCasa} minuta</p>
      </div>

      <div className="info-section">
        <h3 className="highlight">Predmeti:</h3>
        <ul>
          {Object.entries(profile.predmeti || {}).filter(([, v]) => v).map(([k]) => <li key={k}>{k}</li>)}
        </ul>
      </div>

      <div className="info-section">
        <h3 className="highlight">Nivo obrazovanja:</h3>
        <ul>
          {Object.entries(profile.nivoi || {}).filter(([, v]) => v).map(([k]) => <li key={k}>{k}</li>)}
        </ul>
      </div>
      {profile.nacinCasova && (
  <div className="info-section">
    <h3 className="highlight">Način izvođenja časova:</h3>
    <ul>
  {profile.nacinCasova.uzivo && <li>🏠 Uživo</li>}
  {profile.nacinCasova.online && <li>💻 Online</li>}
    </ul>
  </div>
)}


      <div className="button-group">
        <button onClick={() => navigate('/edit-profile')}>✏ Izmeni profil</button>
        <button onClick={() => navigate('/add-availability')}>➕ Dodaj termine</button>
        <button onClick={() => navigate('/calendar-view')}>📅 Kalendar</button>
        <button onClick={handleLogout} className="logout">🚪 Odjavi se</button>
      </div>
    </div>
  );
}
