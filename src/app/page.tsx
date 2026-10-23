import type { Metadata } from "next";
import Link from "next/link";
import { asset } from "@/lib/paths";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: { absolute: "About — Daniel Yi" },
};

export default function AboutPage() {
  return (
    <main className="page">
      <PageHeader title="About" />

      <img
        src={asset("/pfp.jpg")}
        alt="Daniel Yi"
        width={180}
        height={180}
        className="avatar"
      />

      <div className="stack">
        <p>
          Hi, I&apos;m Daniel. I graduated from Cal Poly San Luis Obispo in 2024
          with a B.S. in Computer Science, spent some time as a network engineer
          at Samsung Electronics America, and now I&apos;m in Michigan,
          working as a network admin at LG. I like that no two days are the
          same — it can be stressful, but I always come away knowing more than
          I did the day before.
        </p>

        <p>
          Outside of work, I do whatever I feel like: gaming, music, guitar,
          coding, the gym, reading, in no particular order. At the end of the
          day, we&apos;re all just trying to figure out this thing called life.
        </p>

        <p>
          If you want to see what I&apos;ve been up to lately, check the{" "}
          <Link href="/blog">Blog</Link> or{" "}
          <Link href="/projects">Projects</Link> section.
        </p>
      </div>
    </main>
  );
}
