import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';

// Mapa slugova i putanja do Markdown fajlova
const postMap = {
  'moj-prvi-post': '/posts/moj-prvi-post.md',
  // Dodaj još postova ako ih budeš imala
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
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>{postTitle || 'Blog'} | Pronađi profesora</title>
        <meta
          name="description"
          content={
            postDescription ||
            'Pročitajte zanimljive blog postove o učenju, predavanjima i edukaciji.'
          }
        />

        {/* Open Graph za deljenje */}
        <meta property="og:title" content={`${postTitle} | Pronađi profesora`} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pronadjiprofesora.com/blog/${slug}`} />
        <meta property="og:image" content={`https://www.pronadjiprofesora.com/posts/images/${slug}.png`} />
      </Helmet>

      {/* HERO sekcija */}
      <div className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden mb-10 shadow-xl">
        <img
          src={`/posts/images/${slug}.png`}
          alt="Naslovna slika"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">{postTitle}</h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl">{postDescription}</p>
        </div>
      </div>

      {/* SADRŽAJ */}
      <div className="prose prose-lg dark:prose-invert max-w-none px-6 pb-16 leading-relaxed text-gray-100">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
