import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';

// Mapa slugova i putanja do Markdown fajlova
const postMap = {
  'moj-prvi-post': '/posts/moj-prvi-post.md',
  // Dodaj više ako budeš imala
};

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');

  useEffect(() => {
    if (postMap[slug]) {
      fetch(postMap[slug])
        .then(res => res.text())
        .then((text) => {
          setContent(text);

          // Parsiramo naslov i opis iz prvih linija Markdown fajla
          const lines = text.split('\n');
          const titleLine = lines.find(line => line.startsWith('# '));
          const descriptionLine = lines.find(line => line.startsWith('> '));

          if (titleLine) setPostTitle(titleLine.replace('# ', '').trim());
          if (descriptionLine) setPostDescription(descriptionLine.replace('> ', '').trim());
        })
        .catch(err => {
          console.error('Greška pri učitavanju posta:', err);
          setContent('# Greška\nPost nije učitan.');
        });
    } else {
      setContent('# Nepostojeći post\nOvaj post ne postoji.');
    }
  }, [slug]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Helmet>
        <title>{postTitle || 'Blog'} | Pronađi profesora</title>
        <meta name="description" content={postDescription || 'Pročitajte zanimljive blog postove o učenju, predavanjima i edukaciji.'} />

        {/* Open Graph za deljenje */}
        <meta property="og:title" content={`${postTitle} | Pronađi profesora`} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pronadjiprofesora.com/blog/${slug}`} />
        <meta property="og:image" content={`https://www.pronadjiprofesora.com/posts/images/${slug}.png`} />
      </Helmet>

      {/* HERO */}
      <div className="text-center mb-8">
        <img
          src={`/posts/images/${slug}.png`}
          alt="Naslovna slika"
          className="w-full max-h-[400px] object-cover rounded-2xl shadow-lg mb-6"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{postTitle}</h1>
        <p className="text-lg text-gray-600">{postDescription}</p>
      </div>

      {/* SADRŽAJ */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
