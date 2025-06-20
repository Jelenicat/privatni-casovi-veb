import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="w-full bg-black bg-opacity-70 text-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-50">
      <div className="text-2xl font-bold text-pink-400">
        <Link to="/">Pronađi profesora</Link>
      </div>

      <div className="text-lg">
        <Link to="/blog" className="hover:text-pink-400 transition">
          Pitanja i odgovori
        </Link>
      </div>
    </nav>
  );
}
