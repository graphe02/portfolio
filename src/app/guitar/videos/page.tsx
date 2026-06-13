"use client";

import Link from "next/link";
import { useMemo } from "react";

import { AppFooter } from "@/components/app-footer";
import { VideoCard } from "@/components/video-card";
import { guitarVideos } from "@/lib/data";

import styles from "../chalkboard.module.css";

export default function GuitarVideosPage() {
  const sortedVideos = useMemo(() => {
    return [...guitarVideos].sort((a, b) => {
      const timestampA = parseInt(a.id.split("_")[1], 10);
      const timestampB = parseInt(b.id.split("_")[1], 10);
      return timestampB - timestampA;
    });
  }, []);

  return (
    <>
      <div className={styles.page}>
        <div className={styles.texture} aria-hidden="true" />

        <main className={styles.mainWide}>
          <div className={styles.backLink}>
            <Link
              href="/guitar"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 font-body text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground"
            >
              Back to Guitar Hub
            </Link>
          </div>

          <header className={styles.pageHeader}>
            <h1 className={styles.title}>Guitar Videos Library</h1>
            <p className={styles.subtitle}>
              Dive into demos, covers, and improvisations. Videos are ordered by their
              recording date so the freshest ideas surface first.
            </p>
          </header>

          <section>
            <h2 className={styles.sectionTitle}>Latest Uploads</h2>

            {sortedVideos.length > 0 ? (
              <div className={styles.videoGrid}>
                {sortedVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    className={styles.videoCard}
                    embedClassName={styles.videoEmbed}
                    thumbnailClassName={styles.videoThumbnail}
                    playIconClassName={styles.videoPlayIcon}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No guitar videos yet—check back soon!</p>
              </div>
            )}
          </section>
        </main>
      </div>

      <AppFooter />
    </>
  );
}
