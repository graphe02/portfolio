"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { AppFooter } from "@/components/app-footer";

import chalk from "../chalkboard.module.css";
import styles from "./metronome.module.css";

const TIME_SIGNATURES = [
  { label: "1/4", beatsPerMeasure: 1, subdivisions: 1 },
  { label: "2/4", beatsPerMeasure: 2, subdivisions: 2 },
  { label: "3/3", beatsPerMeasure: 3, subdivisions: 3 },
  { label: "4/4", beatsPerMeasure: 4, subdivisions: 4 },
] as const;

type TimeSignature = (typeof TIME_SIGNATURES)[number];

const MIN_BPM = 40;
const MAX_BPM = 220;
const MAX_DURATION_MINUTES = 60;

export default function MetronomePage() {
  const [bpm, setBpm] = useState(120);
  const [playingBpm, setPlayingBpm] = useState(120);
  const [activeSignature, setActiveSignature] = useState<TimeSignature>(TIME_SIGNATURES[3]);
  const [isRunning, setIsRunning] = useState(false);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [volume, setVolume] = useState(80);
  const [durationMinutes, setDurationMinutes] = useState<number | "">("");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [beatIndex, setBeatIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const subdivisionIndexRef = useRef(0);
  const endTimeRef = useRef<number | null>(null);
  const volumeRef = useRef(volume / 100);
  const playOnStartRef = useRef(true);

  useEffect(() => {
    volumeRef.current = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!isRunning) {
      playOnStartRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    if (!ctx) return;

    const beatDurationMs = 60_000 / playingBpm;
    const subdivisionDurationMs = beatDurationMs / activeSignature.subdivisions;

    function playClick(subdivisionIndex: number) {
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      const isPrimary = subdivisionIndex === 0;

      oscillator.type = "square";
      oscillator.frequency.value = isPrimary ? 2200 : 1400;
      envelope.gain.value = 0.0001;

      oscillator.connect(envelope);
      envelope.connect(ctx.destination);

      const now = ctx.currentTime;
      const targetGain = isPrimary
        ? volumeRef.current
        : Math.max(volumeRef.current * 0.6, 0.0001);

      envelope.gain.exponentialRampToValueAtTime(targetGain, now + 0.001);
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      oscillator.start(now);
      oscillator.stop(now + 0.1);
    }

    const tick = () => {
      const currentSubdivision = subdivisionIndexRef.current;
      playClick(currentSubdivision);

      const nextSubdivision = (currentSubdivision + 1) % activeSignature.subdivisions;
      if (nextSubdivision === 0) {
        setBeatIndex((prev) => (prev + 1) % activeSignature.beatsPerMeasure);
      }

      subdivisionIndexRef.current = nextSubdivision;
    };

    if (playOnStartRef.current) {
      subdivisionIndexRef.current = 0;
      tick();
      playOnStartRef.current = false;
    }

    intervalRef.current = setInterval(tick, subdivisionDurationMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, playingBpm, activeSignature]);

  useEffect(() => {
    if (!isRunning) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      return;
    }

    const totalMs =
      typeof durationMinutes === "number" && durationMinutes > 0
        ? durationMinutes * 60_000
        : null;

    if (totalMs !== null) {
      endTimeRef.current = performance.now() + totalMs;
      setRemainingMs(totalMs);

      countdownRef.current = setInterval(() => {
        if (endTimeRef.current === null) return;
        const remaining = endTimeRef.current - performance.now();
        if (remaining <= 0) {
          setIsRunning(false);
          setRemainingMs(0);
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
        } else {
          setRemainingMs(remaining);
        }
      }, 1000);
    } else {
      setRemainingMs(null);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [isRunning, durationMinutes]);

  const handleToggle = () => {
    if (!isRunning) {
      setPlayingBpm(bpm);
    }

    setIsRunning((prev) => !prev);
    if (isRunning) {
      subdivisionIndexRef.current = 0;
      setBeatIndex(0);
      setRemainingMs(null);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }
  };

  const commitBpm = (value: number) => {
    setPlayingBpm(value);
  };

  const handleTap = () => {
    const now = performance.now();
    setTapTimes((prev) => {
      const updated = [...prev, now].slice(-6);
      if (updated.length >= 2) {
        const intervals = updated
          .slice(1)
          .map((time, index) => time - updated[index]);
        const averageInterval =
          intervals.reduce((total, interval) => total + interval, 0) /
          intervals.length;
        const nextBpm = Math.round(60_000 / averageInterval);
        const clamped = Math.min(MAX_BPM, Math.max(MIN_BPM, nextBpm));
        setBpm(clamped);
        if (isRunning) {
          setPlayingBpm(clamped);
        }
      }
      return updated;
    });
  };

  const bpmLabel = useMemo(() => `${bpm} BPM`, [bpm]);

  const timerLabel = useMemo(() => {
    if (remainingMs === null) {
      return "∞";
    }
    const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [remainingMs]);

  const isCountingDown = isRunning && remainingMs !== null;

  const timerInputValue = isCountingDown
    ? timerLabel
    : durationMinutes === ""
      ? ""
      : String(durationMinutes);

  return (
    <>
      <div className={chalk.page}>
        <div className={chalk.texture} aria-hidden="true" />

        <main className={chalk.mainWide}>
          <div className={chalk.backLink}>
            <Link
              href="/guitar"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 font-body text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground"
            >
              Back to Guitar Hub
            </Link>
          </div>

          <header className={chalk.pageHeaderCenter}>
            <h1 className={chalk.title}>Metronome</h1>
            <p className={chalk.subtitle}>
              Tap tempo, pick a time signature, and dial in a visual + audible pulse to
              match your practice.
            </p>
          </header>

          <section className={chalk.toolPanel}>
            <div className={chalk.toolGrid}>
              <div className={styles.playColumn}>
                <div className={styles.playActions}>
                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`${styles.startStop} ${
                      isRunning ? styles.startStopRunning : styles.startStopIdle
                    }`}
                  >
                    {isRunning ? "Stop" : "Start"}
                  </button>
                  <button
                    type="button"
                    onClick={handleTap}
                    className={styles.tapButton}
                  >
                    Tap Tempo
                  </button>
                </div>

                <div className={styles.timerBlock}>
                  <span className={chalk.controlLabel}>Timer (minutes)</span>
                  <input
                    type="text"
                    inputMode={isCountingDown ? "text" : "numeric"}
                    readOnly={isCountingDown}
                    value={isRunning && remainingMs === null ? "∞" : timerInputValue}
                    onChange={(event) => {
                      if (isCountingDown || isRunning) {
                        return;
                      }
                      const value = event.target.value;
                      if (value === "") {
                        setDurationMinutes("");
                        return;
                      }
                      const nextValue = Math.max(
                        0,
                        Math.min(MAX_DURATION_MINUTES, parseInt(value, 10) || 0)
                      );
                      setDurationMinutes(nextValue === 0 ? "" : nextValue);
                    }}
                    className={styles.numberInput}
                    placeholder="∞"
                  />
                </div>
              </div>

              <div className={styles.controlsColumn}>
                <div className={styles.controlGroup}>
                  <span className={chalk.controlLabel}>Time Signature</span>
                  <div className={styles.pillRow}>
                    {TIME_SIGNATURES.map((signature) => (
                      <button
                        key={signature.label}
                        type="button"
                        onClick={() => setActiveSignature(signature)}
                        className={`${styles.pill} ${
                          signature.label === activeSignature.label
                            ? styles.pillActive
                            : ""
                        }`}
                      >
                        {signature.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <span className={chalk.controlLabel}>Tempo</span>
                  <span className={styles.bpmValue}>{bpmLabel}</span>
                  <input
                    type="range"
                    min={MIN_BPM}
                    max={MAX_BPM}
                    value={bpm}
                    onChange={(event) => setBpm(parseInt(event.target.value, 10))}
                    onPointerUp={(event) =>
                      commitBpm(parseInt(event.currentTarget.value, 10))
                    }
                    onKeyUp={(event) => {
                      if (event.currentTarget instanceof HTMLInputElement) {
                        commitBpm(parseInt(event.currentTarget.value, 10));
                      }
                    }}
                    className={styles.range}
                  />
                  <div className={styles.rangeMeta}>
                    <span>{MIN_BPM}</span>
                    <span>{MAX_BPM}</span>
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <span className={chalk.controlLabel}>Volume</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(event) => setVolume(parseInt(event.target.value, 10))}
                    className={styles.range}
                  />
                  <div className={styles.volumeLabel}>{volume}%</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AppFooter />
    </>
  );
}
