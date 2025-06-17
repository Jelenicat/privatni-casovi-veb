import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const postMap = {
  'moj-prvi-post': '/posts/moj-prvi-post.md',
  // Dodaj i ostale postove ovde ako ih imaš
};

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (postMap[slug]) {
      fetch(postMap[slug])
        .then(res => res.text())
        .then(setContent)
        .catch(err => {
          console.error('Greška pri učitavanju posta:', err);
          setContent('# Greška\nPost nije učitan.');
        });
    } else {
      setContent('# Nepostojeći post\nOvaj post ne postoji.');
    }
  }, [slug]);

  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto p-6">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
