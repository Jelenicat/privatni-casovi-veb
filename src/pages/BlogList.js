import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/posts/index.json')
      .then(res => res.json())
      .then(setPosts)
      .catch(err => console.error('Greška prilikom učitavanja postova:', err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.slug} className="border-b pb-2">
            <Link to={`/blog/${post.slug}`} className="text-xl text-blue-600 hover:underline">
              {post.title}
            </Link>
            <p className="text-sm text-gray-500">{post.date}</p>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
