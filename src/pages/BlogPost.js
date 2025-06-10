import { useEffect, useState } from "react";
import { marked } from "marked";
import { useParams } from "react-router-dom";

export default function BlogPost() {
  const { slug } = useParams();
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const res = await fetch(`/blog/${slug}.md`);
        if (!res.ok) throw new Error("Post ne postoji");
        const text = await res.text();
        setPostContent(text);
      } catch (err) {
        console.error("❌ Greska:", err);
        setError(true);
      }
    }

    fetchBlogPost();
  }, [slug]);

  if (error) return <div>⚠️ Blog post nije pronađen.</div>;

  return (
    <div>
      <h1>{slug.replace("-", " ")}</h1>
      <div dangerouslySetInnerHTML={{ __html: marked(postContent) }} />
    </div>
  );
}
