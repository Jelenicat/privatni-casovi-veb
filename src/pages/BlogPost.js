import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(`/posts/${slug}.md`)
      .then(res => res.text())
      .then(setContent);
  }, [slug]);

  return (
    <div>
      <h1>{slug.replace(/-/g, ' ')}</h1>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
