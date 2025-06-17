import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import matter from 'gray-matter';
import { marked } from 'marked';

const postMap = {
  'moj-prvi-post': '/posts/moj-prvi-post.md',
  // Dodaj i druge ako imaš još
};

export default function BlogPost() {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (postMap[slug]) {
      fetch(postMap[slug])
        .then(res => res.text())
        .then(raw => {
          const { content, data: meta } = matter(raw);
          const html = marked(content);
          setData({ text: html, ...meta });
        })
        .catch(err => console.error('Error loading post:', err));
    } else {
      setData({ text: '<p>Post not found</p>' });
    }
  }, [slug]);

  if (!data) return <div className="p-4">Učitavanje...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Helmet>
        <title>{data.naslov} | Pronađi profesora</title>
        <meta name="description" content={data.opis} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-2">{data.naslov}</h1>
      <p className="text-gray-500 mb-4">{data.opis}</p>
      <div dangerouslySetInnerHTML={{ __html: data.text }} />
    </div>
  );
}
