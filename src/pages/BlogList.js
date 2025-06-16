import React from 'react';
import { Link } from 'react-router-dom';

const posts = [
  { slug: 'moj-prvi-post', title: 'Moj prvi blog post' },
  { slug: 'drugi-post', title: 'Drugi post' },
];

export default function BlogList() {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
