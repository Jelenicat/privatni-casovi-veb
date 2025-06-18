import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const postMap = {
  'moj-prvi-post': '/posts/moj-prvi-post.md',
  'drugi-post': '/posts/drugi-post.md'
};

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState({ title: '', description: '', image: '' });

  useEffect(() => {
    if (postMap[slug]) {
      fetch(postMap[slug])
        .then(res => res.text())
        .then(text => {
          const { content, data } = matter(text);
          const fallbackImage = `/posts/images/${slug}.png`;

          setContent(content);
          setMeta({
            title: data.title || '',
            description: data.description || '',
            image: data.image || fallbackImage
          });
        })
        .catch(err => {
          console.error('Greška pri učitavanju posta:', err);
          setContent('# Greška\nPost nije učitan.');
        });
    } else {
      setContent('# Nepostojeći post\nOvaj post ne postoji.');
    }
  }, [slug]);

  const absoluteImageUrl = meta.image.startsWith('http')
    ? meta.image
    : `https://www.pronadjiprofesora.com${meta.image}`;

  return (
    <div className="w-full bg-black text-white">
      <Helmet>
        <title>{meta.title || 'Blog'} | Pronađi profesora</title>
        <meta name="description" content={meta.description || 'Pročitajte zanimljive blog postove o učenju, predavanjima i edukaciji.'} />
        <meta property="og:title" content={`${meta.title} | Pronađi profesora`} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pronadjiprofesora.com/blog/${slug}`} />
        <meta property="og:image" content={absoluteImageUrl} />
      </Helmet>

      {/* HERO sekcija sa slikom i naslovom */}
      <div className="relative w-full h-[400px] sm:h-[480px] overflow-hidden shadow-lg">
        <img
          src={absoluteImageUrl}
          alt={`Naslovna slika - ${meta.title}`}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/60 flex justify-center items-center text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-pink-400 drop-shadow-lg">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* SADRŽAJ */}
      <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto px-6 mt-12 pb-16 leading-relaxed text-gray-100
        prose-headings:text-pink-400 prose-a:text-pink-400 hover:prose-a:text-pink-300 prose-strong:text-white prose-blockquote:border-pink-400">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
