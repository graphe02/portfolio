import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="page">
      <h1>About</h1>

      <img
        src="/pfp.jpg"
        alt="Daniel Yi"
        width={180}
        height={180}
        className="avatar"
      />

      <div className="stack">
        <p>
          Hi, I&apos;m Daniel. I&apos;m based in Dallas and looking for my next
          opportunity in networks, systems, and telecom. I studied CS at Cal Poly
          SLO, and most recently worked at Samsung doing LTE/5G device validation
          — lots of Wireshark, lots of logs, lots of troubleshooting. That&apos;s more or less
          where I picked up how to actually troubleshoot instead of just guessing.
        </p>
        <p>
          Right now I&apos;m working through the CCNA and honestly still figuring
          out exactly where I want to land next — but I&apos;m trying to absorb as
          much as I can along the way, whether that&apos;s networking fundamentals
          or just paying attention to what clicks.
        </p>
        <p>
          Outside of work, I mess around with random code I find interesting, play
          guitar, listen to a lot of music, and generally try to keep learning new
          things. I&apos;m genuinely grateful we&apos;re living in a time with this
          much stuff to be curious about — there&apos;s always something new to dig
          into. What I&apos;m interested in shifts around a lot, so if you want to
          see what I&apos;ve actually been up to lately, check the{" "}
          <Link href="/blog">Blog</Link> or{" "}
          <Link href="/projects">Projects</Link> section — that&apos;s where the
          real progress (or lack thereof) shows up.
        </p>
      </div>
    </main>
  );
}
