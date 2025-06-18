import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';

const postMap = {
  'moj-prvi-post': '/posts/moj-prvi-post.md',
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
    <div className="w-full bg-black">
      <Helmet>
        <title>{postTitle || 'Blog'} | Pronađi profesora</title>
        <meta name="description" content={postDescription || 'Pročitajte zanimljive blog postove o učenju, predavanjima i edukaciji.'} />
        <meta property="og:title" content={`${postTitle} | Pronađi profesora`} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pronadjiprofesora.com/blog/${slug}`} />
        <meta property="og:image" content={`https://www.pronadjiprofesora.com/posts/images/${slug}.png`} />
      </Helmet>

      {/* HERO sekcija */}
      <div className="relative w-full h-[400px] sm:h-[480px] overflow-hidden shadow-lg">
        <img
          src={`/posts/images/${slug}.png`}
          alt="Naslovna slika"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-pink-400 drop-shadow-lg">
            Kako funkcioniše <span className="italic text-white">Pronađi profesora?</span>
          </h1>
        </div>
      </div>

      {/* SADRŽAJ */}
      <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto px-6 mt-12 pb-16 leading-relaxed text-gray-100 prose-headings:text-pink-400 prose-a:text-pink-400">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
