import { Link } from "react-router-dom";

const posts = [
  { slug: "prvi-post", title: "Prvi Post" },
  { slug: "drugi-post", title: "Drugi Post" },
];

export default function BlogList() {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
