import { useEffect, useState } from "react";
import { marked } from "marked";
import { useParams } from "react-router-dom";

export default function BlogPost() {
  const { slug } = useParams();
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const res = await fetch(`/blog/${slug}.md`);
        const text = await res.text();
        setPostContent(text);
      } catch (error) {
        console.error("❌ Greška pri učitavanju blog posta:", error);
      }
    }

    fetchBlogPost();
  }, [slug]);

  return (
    <div>
      <h1>Blog Post</h1>
      <div dangerouslySetInnerHTML={{ __html: marked(postContent) }} />
    </div>
  );
}
