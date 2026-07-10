import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="page page-wide">
      <h1>Blog</h1>
      <p className="muted">Notes, progress, and whatever I&apos;m digging into.</p>

      <section>
        {posts.length === 0 ? (
          <p className="muted">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <article key={post.slug} className="blog-item">
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.date && <p className="meta">{post.date}</p>}
              {post.summary && <p>{post.summary}</p>}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
