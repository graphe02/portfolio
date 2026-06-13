import Link from "next/link";

import { AppFooter } from "@/components/app-footer";

import styles from "./chalkboard.module.css";

const LINKS = [
  {
    href: "/guitar/videos",
    title: "Guitar Videos",
    description: "Watch performances, demos, and improvisations sorted by newest first.",
  },
  {
    href: "/guitar/chordfinder",
    title: "Interactive Chord Finder",
    description: "Tap out voicings on a virtual fretboard to identify chord names and intervals.",
  },
  {
    href: "/guitar/metronome",
    title: "Metronome",
    description: "Set BPM, choose time signatures, and tap tempo with a visual pulse.",
  },
  {
    href: "/guitar/progressionfinder",
    title: "Progression Finder",
    description: "Explore diatonic chords in any key with an interactive chromatic wheel.",
  },
];

export default function GuitarPage() {
  return (
    <>
      <div className={styles.page}>
        <div className={styles.texture} aria-hidden="true" />

        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>Guitar Hub-WIP</h1>
            <p className={styles.subtitle}>
              Explore tools and videos that capture my guitar journey—from recorded tracks to
              interactive practice helpers.
            </p>
          </header>

          <section className={styles.links}>
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.linkCard}>
                <h2 className={styles.linkTitle}>{link.title} →</h2>
                <p className={styles.linkDescription}>{link.description}</p>
              </Link>
            ))}
          </section>
        </main>
      </div>

      <AppFooter />
    </>
  );
}
