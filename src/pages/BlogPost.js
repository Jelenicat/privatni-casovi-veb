import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';

const postMap = {
  'moj-prvi-post': '/posts/moj-prvi-post.md',
  // Dodaj i ostale postove ako ih imaš
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
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>{postTitle || 'Blog'} | Pronađi profesora</title>
        <meta
          name="description"
          content={
            postDescription ||
            'Pročitajte zanimljive blog postove o učenju, predavanjima i edukaciji.'
          }
        />
        <meta property="og:title" content={`${postTitle} | Pronađi profesora`} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pronadjiprofesora.com/blog/${slug}`} />
        <meta property="og:image" content={`https://www.pronadjiprofesora.com/posts/images/${slug}.png`} />
      </Helmet>

      {/* HERO sekcija */}
      <div className="text-center mb-12">
        <img
          src={`/posts/images/${slug}.png`}
          alt="Naslovna slika"
          className="w-full h-[300px] object-cover rounded-2xl shadow-md mb-6"
        />
        <h1 className="text-5xl font-extrabold text-pink-500 mb-4 tracking-tight leading-tight">
          {postTitle}
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">{postDescription}</p>
      </div>

      {/* SADRŽAJ */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
