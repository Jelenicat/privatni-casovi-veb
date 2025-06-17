import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import mojPrviPost from '../posts/moj-prvi-post.md'; // Adjust path as needed

const postMap = {
  'moj-prvi-post': mojPrviPost,
  // Add more posts here, e.g., 'drugi-post': require('../posts/drugi-post.md')
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
    <div>
      <h1>{slug.replace(/-/g, ' ')}</h1>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}