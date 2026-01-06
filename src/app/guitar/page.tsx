"use client";

import Link from "next/link";

import { AppFooter } from "@/components/app-footer";

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
];

export default function GuitarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900">Guitar Hub-WIP</h1>
          <p className="mt-3 text-base text-gray-600">
            Explore tools and videos that capture my guitar journey—from recorded tracks to
            interactive practice helpers.
          </p>
        </header>

        <section className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-red-500">
                {link.title} →
              </h2>
              <p className="mt-2 text-sm text-gray-600">{link.description}</p>
            </Link>
          ))}
        </section>
      </main>

      <AppFooter />
    </div>
  );
} 