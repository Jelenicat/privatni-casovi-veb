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
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans">
      <Helmet>
        <title>{postTitle || 'Blog'} | Pronađi profesora</title>
        <meta name="description" content={postDescription || 'Blog o privatnim časovima i obrazovanju.'} />
        <meta property="og:title" content={`${postTitle} | Pronađi profesora`} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pronadjiprofesora.com/blog/${slug}`} />
        <meta property="og:image" content={`https://www.pronadjiprofesora.com/posts/images/${slug}.png`} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[500px]">
        <img
          src={`/posts/images/${slug}.png`}
          alt="Naslovna slika"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-5xl font-bold text-pink-500 mb-4 drop-shadow-lg">{postTitle}</h1>
          <p className="text-lg text-gray-200 max-w-2xl italic">{postDescription}</p>
        </div>
      </section>

      {/* Text + Image Split Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto px-6 py-20">
        <div>
          <img src={`/posts/images/${slug}.png`} alt="Ilustracija posta" className="rounded-xl shadow-lg" />
        </div>
        <div>
          <div className="prose prose-invert prose-lg">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </section>

      {/* CTA Button */}
      <div className="text-center pb-20">
        <a
          href="/blog"
          className="inline-block border border-pink-500 text-pink-500 px-6 py-2 rounded-full hover:bg-pink-500 hover:text-black transition"
        >
          ← Nazad na blog
        </a>
      </div>
    </div>
  );
}
