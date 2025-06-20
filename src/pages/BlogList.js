import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/posts/index.json')
      .then(res => res.json())
      .then(setPosts)
      .catch(err => console.error('Greška prilikom učitavanja postova:', err));
  }, []);

  return (
    <div
      className="w-full text-white min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/posts/images/slikaBlogList.png")' }}
    >
      <Helmet>
        <title>Blog | Pronađi profesora</title>
        <meta name="description" content="Zanimljive priče i saveti o učenju, profesorima i obrazovanju." />
      </Helmet>

      {/* Overlay za naslov */}
      <div className="text-center py-12 bg-black bg-opacity-70">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-400">Pitanja i odgovori</h1>
        <p className="mt-4 text-gray-300">Saveti, iskustva i korisni tekstovi za učenike i profesore</p>
      </div>

      {/* Overlay za postove */}
      <div className="grid gap-8 px-6 sm:px-12 pb-20 max-w-6xl mx-auto md:grid-cols-2 lg:grid-cols-3 bg-black bg-opacity-60">
        {posts.map(({ slug, title, description, date, image }) => (
          <div
            key={slug}
            className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-pink-500/30 transition-shadow"
          >
            {image && (
              <img src={image} alt={title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-xl font-bold text-pink-400 mb-1">{title}</h2>
              {date && <p className="text-xs text-gray-400 mb-2">{date}</p>}
              <p className="text-gray-300 flex-grow">{description}</p>
              <Link
                to={`/blog/${slug}`}
                className="mt-4 inline-block text-sm font-medium text-pink-400 hover:text-pink-300 underline"
              >
                Pročitaj više →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
