import React from 'react';
import './HomePage.css';
import bg from '../assets/bg.jpg'; // slika pozadine
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function HomePage({ navigate }) {
  return (
    <>
      <Navbar />

      <div className="background pt-20" style={{ backgroundImage: `url(${bg})` }}>
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
    </>
  );
}
