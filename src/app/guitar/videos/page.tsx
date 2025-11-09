"use client";

import Link from "next/link";
import { ArrowLeft, Music2 } from "lucide-react";
import { useMemo } from "react";

import { AppFooter } from "@/components/app-footer";
import { VideoCard } from "@/components/video-card";
import { guitarVideos } from "@/lib/data";

export default function GuitarVideosPage() {
  const sortedVideos = useMemo(() => {
    return [...guitarVideos].sort((a, b) => {
      const timestampA = parseInt(a.id.split("_")[1], 10);
      const timestampB = parseInt(b.id.split("_")[1], 10);
      return timestampB - timestampA;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-10 space-y-4">
          <Link
            href="/guitar"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Guitar Hub
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Guitar Videos Library
            </h1>
            <p className="max-w-2xl text-base text-gray-600">
              Dive into demos, covers, and improvisations. Videos are ordered
              by their recording date so the freshest ideas surface first.
            </p>
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Latest Uploads
            </h2>
          </div>

          {sortedVideos.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 py-12 text-center">
              <Music2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">
                No guitar videos yet—check back soon!
              </p>
            </div>
          )}
        </section>
      </main>

      <AppFooter />
    </div>
  );
}

