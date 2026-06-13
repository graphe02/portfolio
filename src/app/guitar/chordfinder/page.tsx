"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppFooter } from "@/components/app-footer";

import chalk from "../chalkboard.module.css";
import {
  findChordCandidates,
  getDegreeTensionCategory,
  type ChordEvaluation,
} from "./chordEvaluator";
import styles from "./chordfinder.module.css";

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

const STRING_OPEN_MIDI = [64, 59, 55, 50, 45, 40];

const STRING_LINE_CLASS = [
  styles.stringLine0,
  styles.stringLine1,
  styles.stringLine2,
  styles.stringLine3,
  styles.stringLine4,
  styles.stringLine5,
];

type FretPosition = `${number}:${number}`;

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

  const selectedNotes = useMemo(() => {
    return Array.from(selectedPositions).map((position) => {
      const [stringIndex, fret] = position.split(":").map(Number);
      const baseKey = STRING_TUNING[stringIndex]?.key ?? 0;
      const pitchClass = (baseKey + fret) % 12;
      const midi = (STRING_OPEN_MIDI[stringIndex] ?? 60) + fret;
      return { pitchClass, midi };
    });
  }, [selectedPositions]);

  const bassPitchClass = useMemo(() => {
    if (selectedNotes.length === 0) {
      return 0;
    }
    return selectedNotes.reduce((lowest, note) =>
      note.midi < lowest.midi ? note : lowest
    ).pitchClass;
  }, [selectedNotes]);

  const chordCandidates = useMemo<ChordEvaluation[]>(() => {
    if (selectedNotes.length === 0) {
      return [];
    }
    return findChordCandidates(
      selectedNotes.map((note) => note.pitchClass),
      bassPitchClass
    );
  }, [selectedNotes, bassPitchClass]);

  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);

  const activeCandidate =
    chordCandidates[selectedCandidateIndex] ?? chordCandidates[0];

  useEffect(() => {
    setSelectedCandidateIndex(0);
  }, [chordCandidates.length]);

  const clearSelection = () => setSelectedPositions(new Set<FretPosition>());

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
            <h1 className={chalk.title}>Interactive Chord Finder</h1>
            <p className={chalk.subtitle}>
              Tap on a single fret per string to build a voicing. The recognizer matches
              common chord shapes across inversions. Click a highlighted fret to clear it.
            </p>
          </header>

          <section className={chalk.toolPanel}>
            <div className={styles.fretboardWrap}>
              <div className={styles.fretboard}>
                <div className={styles.fretHeader}>
                  {fretNumbers.map((fret) => (
                    <div key={`header-${fret}`} className={styles.fretHeaderCell}>
                      {fret === 0 ? "Open" : fret}
                    </div>
                  ))}
                </div>
                {STRING_TUNING.map((string, stringIndex) => (
                  <div key={string.label} className={styles.stringRow}>
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
                            styles.fretCell,
                            fret === 0 ? styles.fretCellOpen : "",
                            isSelected ? styles.fretCellSelected : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          aria-label={`${isSelected ? "Selected" : "Unselected"} note ${note} on fret ${fret}`}
                        >
                          {isSelected ? (
                            <span
                              className={`${styles.fretNote} ${styles.fretNoteSelected}`}
                            >
                              {note}
                            </span>
                          ) : fret === 0 ? (
                            <span
                              className={`${styles.fretNote} ${styles.fretNoteOpen}`}
                            >
                              {note}
                            </span>
                          ) : null}
                          <span
                            className={`${styles.stringLine} ${
                              STRING_LINE_CLASS[stringIndex] ??
                              STRING_LINE_CLASS[STRING_LINE_CLASS.length - 1]
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))}
                <div className={styles.fretMarkerOverlay} aria-hidden="true">
                  {fretNumbers.map((fret) => (
                    <div key={`marker-${fret}`} className={styles.fretMarkerCell}>
                      {MARKED_FRETS.has(fret) && fret !== 0 ? (
                        DOUBLE_MARKER_FRETS.has(fret) ? (
                          <>
                            <span className={styles.fretMarker} />
                            <span className={styles.fretMarker} />
                          </>
                        ) : (
                          <span className={styles.fretMarker} />
                        )
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.actionsRow}>
              {selectedPositions.size > 0 ? (
                <button
                  type="button"
                  onClick={clearSelection}
                  className={styles.clearButton}
                >
                  Clear selection
                </button>
              ) : null}
            </div>

            <div className={styles.panelGrid}>
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Potential chords</h3>
                  <span className={styles.panelMeta}>
                    {chordCandidates.length} match
                    {chordCandidates.length === 1 ? "" : "es"}
                  </span>
                </div>
                {chordCandidates.length > 0 ? (
                  <ul className={styles.candidateList}>
                    {chordCandidates.map((candidate, index) => (
                      <li
                        key={`${candidate.name}-${index}`}
                        className={`${styles.candidateItem} ${
                          index === selectedCandidateIndex
                            ? styles.candidateItemActive
                            : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedCandidateIndex(index)}
                          className={styles.candidateButton}
                        >
                          <span className={styles.candidateName}>
                            {candidate.name}
                          </span>
                          <span className={styles.candidateTag}>
                            {index === selectedCandidateIndex
                              ? "active"
                              : candidate.label.toLowerCase()}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyText}>
                    Add more notes to see matching chords.
                  </p>
                )}
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Note degrees</h3>
                  {activeCandidate ? (
                    <span className={styles.panelMeta}>
                      Root: {keyToNote(activeCandidate.rootKey)}
                    </span>
                  ) : null}
                </div>

                <div className={styles.degreeRows}>
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
                          return { label, interval, text: `${match.note} ${label}` };
                        })
                        .filter(
                          (value): value is { label: string; interval: number; text: string } =>
                            Boolean(value)
                        );

                      if (entries.length === 0) {
                        return null;
                      }

                      return (
                        <div key={`degree-row-${rowIndex}`} className={styles.degreeRow}>
                          {entries.map((entry) => {
                            const tensionCategory = getDegreeTensionCategory(
                              entry.interval,
                              activeCandidate
                            );

                            return (
                              <span
                                key={`${entry.text}-${entry.interval}`}
                                className={
                                  tensionCategory === "natural"
                                    ? styles.degreeNatural
                                    : tensionCategory === "altered"
                                      ? styles.degreeAltered
                                      : undefined
                                }
                              >
                                {entry.text}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })
                  ) : (
                    <p className={styles.degreeEmpty}>
                      Select frets to view chord tones.
                    </p>
                  )}
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

