"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

const TIME_SIGNATURES = [
  { label: "1/4", beatsPerMeasure: 1, subdivisions: 1 },
  { label: "2/4", beatsPerMeasure: 2, subdivisions: 2 },
  { label: "3/3", beatsPerMeasure: 3, subdivisions: 3 },
  { label: "4/4", beatsPerMeasure: 4, subdivisions: 4 },
] as const;

const MIN_BPM = 40;
const MAX_BPM = 220;
const MIN_DURATION_MINUTES = 1;
const MAX_DURATION_MINUTES = 60;

export default function MetronomePage() {
  const [bpm, setBpm] = useState(120);
  const [activeSignature, setActiveSignature] = useState(TIME_SIGNATURES[3]);
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

  useEffect(() => {
    volumeRef.current = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!isRunning) {
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

    const beatDurationMs = 60_000 / bpm;
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
      const targetGain = isPrimary ? volumeRef.current : Math.max(volumeRef.current * 0.6, 0.0001);

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

    subdivisionIndexRef.current = 0;
    tick();
    intervalRef.current = setInterval(tick, subdivisionDurationMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, bpm, activeSignature]);

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
      }, 200);
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

  const handleTap = () => {
    const now = performance.now();
    setTapTimes((prev) => {
      const updated = [...prev, now].slice(-6);
      if (updated.length >= 2) {
        const intervals = updated
          .slice(1)
          .map((time, index) => time - updated[index]);
        const averageInterval =
          intervals.reduce((total, interval) => total + interval, 0) / intervals.length;
        const nextBpm = Math.round(60_000 / averageInterval);
        setBpm(Math.min(MAX_BPM, Math.max(MIN_BPM, nextBpm)));
      }
      return updated;
    });
  };

  const bpmLabel = useMemo(() => `${bpm} BPM`, [bpm]);

  const timerLabel = useMemo(() => {
    if (remainingMs === null) {
      return "∞";
    }
    const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [remainingMs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-start">
          <Link
            href="/guitar"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground"
          >
            Back to Guitar Hub
          </Link>
        </div>

        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900">Metronome</h1>
          <p className="mt-3 text-base text-gray-600">
            Tap tempo, pick a time signature, and dial in a visual + audible pulse to match your practice.
          </p>
        </header>

        <section className="mx-auto mt-12 grid max-w-4xl gap-10 rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={handleToggle}
                  className={[
                    "h-24 w-24 rounded-full text-lg font-semibold transition",
                    isRunning
                      ? "bg-red-500 text-white shadow-lg hover:bg-red-600"
                      : "bg-emerald-500 text-white shadow hover:bg-emerald-600",
                  ].join(" ")}
                >
                  {isRunning ? "Stop" : "Start"}
                </button>
                <button
                  type="button"
                  onClick={handleTap}
                  className="rounded-full border border-gray-300 bg-white px-4 py-1 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
                >
                  Tap Tempo
                </button>
              </div>

              <div className="flex flex-col items-center gap-3 text-center">
                <span className="text-xs uppercase tracking-wide text-gray-500">Timer (minutes)</span>
                <input
                  type="number"
                  min={0}
                  max={MAX_DURATION_MINUTES}
                  value={durationMinutes === "" ? "" : durationMinutes}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === "") {
                      setDurationMinutes("");
                      return;
                    }
                    const nextValue = Math.max(0, Math.min(MAX_DURATION_MINUTES, parseInt(value, 10) || 0));
                    setDurationMinutes(nextValue === 0 ? "" : nextValue);
                  }}
                  className="w-full max-w-[120px] rounded-md border border-gray-300 px-2 py-1 text-center"
                  placeholder="∞"
                />
                <div className="text-sm font-semibold text-gray-900">{timerLabel}</div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-wide text-gray-500">Time Signature</span>
                <div className="flex flex-wrap gap-2">
                  {TIME_SIGNATURES.map((signature) => (
                    <button
                      key={signature.label}
                      type="button"
                      onClick={() => setActiveSignature(signature)}
                      className={[
                        "rounded-full border px-4 py-1 text-xs font-semibold transition",
                        signature.label === activeSignature.label
                          ? "border-red-500 bg-red-500 text-white shadow"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
                      ].join(" ")}
                    >
                      {signature.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-gray-500">Tempo</span>
                <span className="text-4xl font-bold text-gray-900">{bpmLabel}</span>
                <input
                  type="range"
                  min={MIN_BPM}
                  max={MAX_BPM}
                  value={bpm}
                  onChange={(event) => setBpm(parseInt(event.target.value, 10))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-wide text-gray-400">
                  <span>{MIN_BPM}</span>
                  <span>{MAX_BPM}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-gray-500">Volume</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(event) => setVolume(parseInt(event.target.value, 10))}
                  className="w-full"
                />
                <div className="text-[10px] uppercase tracking-wide text-gray-400">{volume}%</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
