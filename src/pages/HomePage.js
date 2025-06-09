import React from 'react';
import './HomePage.css';
import bg from '../assets/bg.jpg'; // obavezno ubaci sliku u public ili src/assets
import Footer from '../components/Footer';


export default function HomePage({ navigate }) {
  return (
    <div className="background" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        <div className="header">
          <h1 className="title">Dobrodošli</h1>
          <p className="subtitle">Pronađi profesora za privatne časove ili postani profesor</p>
        </div>

        <div className="buttonsWrapper">
          <button className="gradientButton pink" onClick={() => navigate('/mode')}>
            Pretraži profesore (učenik)
          </button>
          <button className="gradientButton red" onClick={() => navigate('/auth-choice')}>
            Prijava profesora
          </button>
        </div>
      </div>
      <Footer />

    </div>
    
  );
}
