"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { chordPatterns } from "./chordPatterns";
import { ArrowLeft } from "lucide-react";

const DEGREE_ROWS = [
  [{ label: "1", interval: 0 }],
  [
    { label: "sus2", interval: 2 },
    { label: "m3", interval: 3 },
    { label: "3", interval: 4 },
    { label: "sus4", interval: 5 },
  ],
  [
    { label: "♭5", interval: 6 },
    { label: "5", interval: 7 },
    { label: "#5", interval: 8 },
  ],
  [
    { label: "♭6", interval: 8 },
    { label: "6", interval: 9 },
    { label: "dim7", interval: 10 },
    { label: "7", interval: 11 },
    { label: "maj7", interval: 11 },
  ],
  [
    { label: "♭9", interval: 1 },
    { label: "9", interval: 2 },
    { label: "#9", interval: 3 },
  ],
  [
    { label: "11", interval: 5 },
    { label: "#11", interval: 6 },
  ],
  [
    { label: "♭13", interval: 8 },
    { label: "13", interval: 9 },
  ],
];

const STRING_LINE_STYLES = [
  "h-px opacity-70",
  "h-[1.25px] opacity-75",
  "h-[1.5px] opacity-80",
  "h-[1.75px] opacity-85",
  "h-[2px] opacity-90",
  "h-[2.5px] opacity-95",
];

type FretPosition = `${number}:${number}`;

type ChordDegree = {
  note: string;
  degree: string;
  selected: boolean;
  interval: number;
};

type ChordCandidate = {
  name: string;
  rootKey: number;
  allDegrees: ChordDegree[];
  selectedDegrees: ChordDegree[];
};

const STRING_TUNING = [
  { label: "1st • E", key: noteToKey("E") },
  { label: "2nd • B", key: noteToKey("B") },
  { label: "3rd • G", key: noteToKey("G") },
  { label: "4th • D", key: noteToKey("D") },
  { label: "5th • A", key: noteToKey("A") },
  { label: "6th • E", key: noteToKey("E") },
] as const;

const TOTAL_FRETS = 13; // open + 12 frets

const fretNumbers = Array.from({ length: TOTAL_FRETS }, (_, index) => index);
const MARKED_FRETS = new Set([3, 5, 7, 9, 12]);
const DOUBLE_MARKER_FRETS = new Set([12]);

export default function ChordFinderPage() {
  const [selectedPositions, setSelectedPositions] = useState<Set<FretPosition>>(
    () => new Set<FretPosition>()
  );

  const toggleFret = (stringIndex: number, fret: number) => {
    setSelectedPositions((prev) => {
      const next = new Set(prev);
      const position = `${stringIndex}:${fret}` as FretPosition;

      const alreadySelected = next.has(position);
      const stringPrefix = `${stringIndex}:`;

      for (const value of Array.from(next)) {
        if (value.startsWith(stringPrefix)) {
          next.delete(value);
        }
      }

      if (!alreadySelected) {
        next.add(position);
      }
      return next;
    });
  };

  const selectedKeys = useMemo(() => {
    return Array.from(selectedPositions).map((position) => {
      const [stringIndex, fret] = position.split(":").map(Number);
      const baseKey = STRING_TUNING[stringIndex]?.key ?? 0;
      return (baseKey + fret) % 12;
    });
  }, [selectedPositions]);

  const selectedPitchClasses = useMemo(() => {
    return uniqueValues(selectedKeys);
  }, [selectedKeys]);

  const chordCandidates = useMemo<ChordCandidate[]>(() => {
    if (selectedKeys.length === 0) {
      return [];
    }
    return findChordCandidates(selectedKeys);
  }, [selectedKeys]);

  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);

  const activeCandidate =
    chordCandidates[selectedCandidateIndex] ?? chordCandidates[0];

  useEffect(() => {
    setSelectedCandidateIndex(0);
  }, [chordCandidates.length]);

  const chordName = activeCandidate?.name ?? null;

  useEffect(() => {
    const positions = Array.from(selectedPositions.values());
    if (positions.length === 0) {
      console.log("[ChordFinder] No frets selected");
    } else {
      console.log("[ChordFinder] Selected positions:", positions);
      console.log("[ChordFinder] Selected pitch classes:", selectedPitchClasses);
      console.log(
        "[ChordFinder] Chord candidates:",
        chordCandidates.map((candidate) => candidate.name)
      );
      console.log(
        "[ChordFinder] Active candidate:",
        activeCandidate?.name ?? "—"
      );
    }
  }, [
    selectedPositions,
    selectedPitchClasses,
    chordCandidates,
    activeCandidate,
  ]);

  const clearSelection = () => setSelectedPositions(new Set<FretPosition>());

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <header className="space-y-4">
        <Link
          href="/guitar"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground"
        >
            <ArrowLeft className="h-4 w-4" />
          Back to Guitar Hub
        </Link>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Interactive Chord Finder</h1>
          <p className="text-xs text-muted-foreground">
            Tap on a single fret per string to build a voicing. The recognizer matches common chord
            shapes across inversions. Click a highlighted fret to clear it.
          </p>
        </div>
      </header>

      <section className="space-y-4 rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
        <div className="overflow-x-auto">
          <div className="relative min-w-[592px] rounded-3xl border border-amber-900/60 bg-gradient-to-br from-amber-900/60 via-amber-800/55 to-amber-900/60 p-2 shadow-inner">
            <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] text-[10px] uppercase tracking-wide text-foreground/80">
              {fretNumbers.map((fret) => (
                <div
                  key={`header-${fret}`}
                  className="flex h-6 items-center justify-center border-l border-amber-900/70 first:border-l-0"
                >
                  {fret === 0 ? "Open" : fret}
                </div>
              ))}
            </div>
            {STRING_TUNING.map((string, stringIndex) => (
              <div
                key={string.label}
                className="grid grid-cols-[repeat(13,minmax(0,1fr))] border-t border-amber-900/70"
              >
                {fretNumbers.map((fret) => {
                  const position = `${stringIndex}:${fret}` as FretPosition;
                  const isSelected = selectedPositions.has(position);
                  const note = keyToNote((string.key + fret) % 12);

                  return (
                    <button
                      key={position}
                      type="button"
                      onClick={() => toggleFret(stringIndex, fret)}
                      className={[
                        "relative flex h-8 items-center justify-center border-l border-amber-900/70 transition first:border-l-0",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-amber-900/60",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                          : fret === 0
                          ? "bg-amber-900/75 text-foreground hover:bg-amber-700/80 hover:text-foreground"
                          : "bg-transparent text-foreground/85 hover:bg-amber-700/50 hover:text-foreground",
                      ].join(" ")}
                      aria-label={`${isSelected ? "Selected" : "Unselected"} note ${note} on fret ${fret}`}
                    >
                      {(isSelected || fret === 0) ? (
                        <span
                          className={[
                            "text-[10px] font-semibold uppercase tracking-wide",
                            fret === 0
                              ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]"
                              : "",
                          ].join(" ")}
                        >
                          {note}
                        </span>
                      ) : null}
                      <span
                        className={[
                          "pointer-events-none absolute inset-x-1/2 top-1/2 w-[calc(100%-10px)] -translate-x-1/2 -translate-y-1/2 bg-amber-200/40",
                          STRING_LINE_STYLES[stringIndex] ??
                            STRING_LINE_STYLES[STRING_LINE_STYLES.length - 1],
                        ].join(" ")}
                      />
                      {MARKED_FRETS.has(fret) && fret !== 0 ? (
                        <span className="pointer-events-none absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-200/90 shadow-sm" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedPositions.size > 0 ? (
            <button
              type="button"
              onClick={clearSelection}
              className="ml-auto rounded-md border border-input px-2.5 py-0.5 text-[11px] font-medium transition hover:bg-accent hover:text-accent-foreground"
            >
              Clear selection
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-border/80 bg-background/75 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Potential chords
              </h3>
              <span className="text-[11px] text-muted-foreground">
                {chordCandidates.length} match
                {chordCandidates.length === 1 ? "" : "es"}
              </span>
            </div>
            {chordCandidates.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm">
                {chordCandidates.map((candidate, index) => (
                  <li
                    key={`${candidate.name}-${index}`}
                    className={[
                      "flex items-center justify-between rounded-lg border px-3 py-2 transition",
                      index === selectedCandidateIndex
                        ? "border-primary/70 bg-primary/10 text-primary-foreground"
                        : "border-border/70 bg-background/40 text-foreground/80 hover:bg-muted/60",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCandidateIndex(index)}
                      className={[
                        "flex flex-1 items-center justify-between rounded-md px-2 py-1 text-left transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "font-medium",
                          index === selectedCandidateIndex
                            ? "text-foreground"
                            : "text-foreground/80",
                        ].join(" ")}
                      >
                        {candidate.name}
                      </span>
                      <span
                        className={[
                          "text-[10px] uppercase tracking-wide",
                          index === selectedCandidateIndex
                            ? "font-semibold text-primary"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {index === selectedCandidateIndex ? "active" : "select"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Add more notes to see matching chords.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border/80 bg-background/75 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Note degrees
              </h3>
              {activeCandidate ? (
                <span className="text-[11px] text-muted-foreground">
                  Root: {keyToNote(activeCandidate.rootKey)}
                </span>
              ) : null}
            </div>

            <div className="mt-4 space-y-1.5 text-xs font-semibold uppercase tracking-wide text-white">
              {activeCandidate ? (
                DEGREE_ROWS.map((row, rowIndex) => {
                  const entries = row
                    .map(({ label, interval }) => {
                      const match = activeCandidate.allDegrees.find(
                        (degree) => degree.interval === interval
                      );
                      if (!match) {
                        return null;
                      }
                      return `${match.note} ${label}`;
                    })
                    .filter((value): value is string => Boolean(value));

                  if (entries.length === 0) {
                    return null;
                  }

                  return (
                    <div
                      key={`degree-row-${rowIndex}`}
                      className="flex flex-wrap gap-3 text-black"
                    >
                      {entries.map((entry, entryIndex) => (
                        <span key={`${entry}-${entryIndex}`}>{entry}</span>
                      ))}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs uppercase tracking-wide text-white/70">
                  Select frets to view chord tones.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function noteToKey(note: string): number {
  const keyMap = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };
  return keyMap[note as keyof typeof keyMap] ?? 0;
}

function keyToNote(key: number): string {
  const noteMap = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B",
  };
  return noteMap[key as keyof typeof noteMap] ?? "C";
}

function findChordCandidates(keys: number[]): ChordCandidate[] {
  const uniqueKeys = uniqueValues(keys).sort((a, b) => a - b);
  const matches: ChordCandidate[] = [];

  if (uniqueKeys.length === 0) {
    return matches;
  }

  for (const [chordName, pattern] of Object.entries(chordPatterns)) {
    const normalizedPattern = normalizePattern(pattern);
    if (uniqueKeys.length !== normalizedPattern.length) {
      continue;
    }

    for (const rootKey of uniqueKeys) {
      const candidate = normalizedPattern
        .map((interval) => (rootKey + interval) % 12)
        .sort((a, b) => a - b);

      if (arraysEqual(candidate, uniqueKeys)) {
        const allDegrees = buildDegrees(rootKey, normalizedPattern, uniqueKeys);
        matches.push({
          name: `${keyToNote(rootKey)} ${formatChordName(chordName)}`,
          rootKey,
          allDegrees,
          selectedDegrees: allDegrees.filter((degree) => degree.selected),
        });
      }
    }
  }

  return matches;
}

function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function formatChordName(name: string): string {
  const lookup: Record<string, string> = {
    major: "maj",
    minor: "min",
    diminished: "dim",
    augmented: "aug",
    sus2: "sus2",
    sus4: "sus4",
    maj7: "maj7",
    dom7: "7",
    min7: "m7",
    minMaj7: "m(maj7)",
    halfDim7: "m7b5",
    dim7: "dim7",
    min9: "m9",
    dom9: "9",
    maj9: "maj9",
    halfDim9: "m9b5",
    dim9: "dim9",
    minMaj9: "m(maj9)",
    maj11: "maj11",
    dom11: "11",
    min11: "m11",
    halfDim11: "m11b5",
    dim11: "dim11",
    minMaj11: "m(maj11)",
    maj13: "maj13",
    dom13: "13",
    min13: "m13",
    halfDim13: "m13b5",
    dim13: "dim13",
    minMaj13: "m(maj13)",
  };

  if (lookup[name] !== undefined) {
    return lookup[name];
  }

  if (name.startsWith("min")) {
    return `m${name.slice(3)}`;
  }

  return name;
}

function normalizePattern(pattern: readonly number[]): number[] {
  if (pattern.length === 0) {
    return [];
  }
  const min = pattern[0];
  return pattern
    .map((value) => (value - min + 12) % 12)
    .map((value) => (value === 12 ? 0 : value))
    .sort((a, b) => a - b);
}

function uniqueValues<T>(values: T[]): T[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}

function buildDegrees(
  rootKey: number,
  patternIntervals: number[],
  selectedKeys: number[]
): ChordDegree[] {
  const uniqueIntervals = uniqueValues(patternIntervals).sort((a, b) => a - b);
  return uniqueIntervals.map((interval) => {
    const wrappedInterval = ((interval % 12) + 12) % 12;
    const noteKey = (rootKey + wrappedInterval) % 12;
    return {
      note: keyToNote(noteKey),
      degree: intervalToDegree(wrappedInterval),
      selected: selectedKeys.includes(noteKey),
      interval: wrappedInterval,
    };
  });
}

function intervalToDegree(interval: number): string {
  const degreeLabels: Record<number, string> = {
    0: "1",
    1: "b2",
    2: "2",
    3: "b3",
    4: "3",
    5: "4",
    6: "b5",
    7: "5",
    8: "b6",
    9: "6",
    10: "b7",
    11: "7",
  };

  return degreeLabels[interval] ?? `${interval + 1}`;
}

