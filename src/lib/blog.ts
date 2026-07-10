import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

function getMarkdownFiles() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"));
}

/** Normalize frontmatter dates to YYYY-MM-DD (no time / timezone / weekday). */
function formatDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const raw = String(value).trim();
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : raw;
}

export function getAllPosts(): BlogPostMeta[] {
  return getMarkdownFiles()
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
      const { data } = matter(raw);

      return {
        slug,
        title: String(data.title ?? slug),
        date: formatDate(data.date),
        summary: String(data.summary ?? ""),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);

  return {
    slug,
    title: String(data.title ?? slug),
    date: formatDate(data.date),
    summary: String(data.summary ?? ""),
    contentHtml: processed.toString(),
  };
}
