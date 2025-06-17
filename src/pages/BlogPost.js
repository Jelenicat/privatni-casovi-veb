import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';
import matter from 'gray-matter';

const { content, data } = matter(text);

<Helmet>
  <title>{naslov} | Pronađi profesora</title>
  <meta name="description" content={opis} />
</Helmet>

const postMap = {
  'moj-prvi-post': '/posts/moj-prvi-post.md',
  // Dodaj i druge ako želiš
};

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (postMap[slug]) {
      fetch(postMap[slug])
        .then(res => res.text())
        .then(setContent)
        .catch(err => console.error('Error loading post:', err));
    } else {
      setContent('Post not found');
    }
  }, [slug]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
