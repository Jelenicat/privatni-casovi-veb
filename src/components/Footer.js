import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/privatnost">Politika privatnosti</Link>
        <span>·</span>
        <Link to="/uslovi">Uslovi korišćenja</Link>
        <span>·</span>
        <Link to="/kontakt">Kontakt</Link>
      </div>
    </footer>
  );
}
