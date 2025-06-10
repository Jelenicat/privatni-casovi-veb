import { useEffect, useState } from "react";
import { marked } from "marked";

export default function BlogPost({ match }) {
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const res = await fetch(`/blog/${match.params.slug}.md`);
        const text = await res.text();
        setPostContent(text);
      } catch (error) {
        console.error("❌ Greška pri učitavanju blog posta:", error);
      }
    }

    fetchBlogPost();
  }, [match.params.slug]);

  return (
    <div>
      <h1>Blog Post</h1>
      <div dangerouslySetInnerHTML={{ __html: marked(postContent) }} />
    </div>
  );
}
