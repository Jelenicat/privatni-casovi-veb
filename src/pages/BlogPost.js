import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';

const postMap = {
  'moj-prvi-post': '/posts/moj-prvi-post.md',
  'drugi-post': '/posts/drugi-post.md' // ⬅⬅⬅ Dodaj ovo
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
          const lines = text.split('\n');
          const titleLine = lines.find(line => line.startsWith('# '));
          const descriptionLine = lines.find(line => line.startsWith('> '));

          if (titleLine) setPostTitle(titleLine.replace('# ', '').trim());
          if (descriptionLine) setPostDescription(descriptionLine.replace('> ', '').trim());

          const cleanedLines = lines.filter(line => !line.startsWith('# '));
          setContent(cleanedLines.join('\n'));
        })
        .catch(err => {
          console.error('Greška pri učitavanju posta:', err);
          setContent('# Greška\nPost nije učitan.');
        });
    } else {
      setContent('# Nepostojeći post\nOvaj post ne postoji.');
    }
  }, [slug]);

  // Pripremi naslov sa stilizovanim delom
  const formattedTitle = postTitle
    ? postTitle.replace(/(Pronađi profesora\??)/, `<span class="italic text-white">$1</span>`)
    : '';

  return (
    <div className="w-full bg-black text-white">
      <Helmet>
        <title>{postTitle || 'Blog'} | Pronađi profesora</title>
        <meta name="description" content={postDescription || 'Pročitajte zanimljive blog postove o učenju, predavanjima i edukaciji.'} />
        <meta property="og:title" content={`${postTitle} | Pronađi profesora`} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pronadjiprofesora.com/blog/${slug}`} />
        <meta property="og:image" content={`https://www.pronadjiprofesora.com/posts/images/${slug}.png`} />
      </Helmet>

      {/* HERO sekcija sa stilizovanim naslovom */}
      <div className="relative w-full h-[400px] sm:h-[480px] overflow-hidden shadow-lg">
        <img
          src={`/posts/images/${slug}.png`}
          alt={`Naslovna slika - ${postTitle}`}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/60 flex justify-center items-center text-center px-4">
          <h1
            className="text-3xl sm:text-5xl font-extrabold text-pink-400 drop-shadow-lg"
            dangerouslySetInnerHTML={{ __html: formattedTitle }}
          />
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
