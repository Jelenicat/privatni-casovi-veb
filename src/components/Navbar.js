import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="w-full bg-black bg-opacity-70 text-white px-6 py-4 flex justify-center items-center shadow-md fixed top-0 left-0 z-50">
      <Link to="/blog" className="text-lg font-medium text-white hover:text-pink-400 transition">
        Pitanja i odgovori
      </Link>
    </nav>
  );
}
