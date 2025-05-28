import React from 'react';
import './HomePage.css';
import bg from '../assets/bg.jpg';

export default function HomePage({ navigate }) {
  return (
    <div className="background" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        <div className="header">
          <h1 className="title">Dobrodošli</h1>
          <p className="subtitle">Pronađi profesora za privatne časove ili postani profesor</p>
        </div>

        <div className="buttonsWrapper">
          <button className="gradientButton pink" onClick={() => navigate('/education')}>
            Pretraži profesore (učenik)
          </button>
          <button className="gradientButton red" onClick={() => navigate('/auth-choice')}>
            Prijava profesora
          </button>
        </div>

    
    {/* ✅ SEO tekst sekcija */}
<section className="seo-section">
  <h2>Privatni časovi za sve nivoe obrazovanja</h2>
  <p>
    Na platformi <strong>Privatni časovi</strong> možete pronaći iskusne profesore za 
    <strong> matematiku, engleski jezik, fiziku, hemiju, informatiku, srpski jezik</strong> i druge predmete.
    Časovi su dostupni za <strong>osnovnu školu, srednju školu</strong> i <strong>fakultet</strong>.
  </p>
  <p>
    Učenici mogu brzo i jednostavno pronaći profesora, pregledati njegove slobodne termine i zakazati čas – bez registracije.
    Profesori mogu napraviti nalog, uneti predmete koje predaju i postaviti svoje termine.
  </p>
  <p>
    Ova platforma je namenjena i <strong>učenicima</strong> koji traže pomoć, i <strong>profesorima</strong> koji žele da ponude svoje usluge.
  </p>
</section>

      </div>
    </div>
  );
}
