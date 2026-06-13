"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

import { AppFooter } from "@/components/app-footer";

import styles from "./wheel.module.css";

const CX = 250;
const CY = 250;
const OUTER_RING_INNER = 190;
const OUTER_RING_LABEL_R = 214;
const WHEEL_OUTER_R = 182;
const WHEEL_SPLIT_R = 150;
const WHEEL_INNER_R = 118;
const SEGMENT_HALF_WIDTH = 13.6;
const SEGMENT_GAP_STROKE = 2;

const CHALK_COLORS = {
  major: "#7eb0dc",
  minor: "#d4915a",
  diminished: "#c97a7a",
} as const;

type ChordQuality = keyof typeof CHALK_COLORS;

type DegreeEntry = {
  numeral: string;
  quality: ChordQuality;
};

type RingSlot = DegreeEntry | null;

type NoteLabel = {
  primary: string;
  secondary?: string;
};

type SegmentEntry = {
  index: number;
  major: NoteLabel;
  minor: NoteLabel;
};

function noteLabel(primary: string, secondary?: string): NoteLabel {
  return secondary ? { primary, secondary } : { primary };
}

const MAJOR_MODES = [
  {
    id: "ionian",
    label: "Ionian",
    degrees: [
      { numeral: "I", interval: 0, quality: "major" as const },
      { numeral: "ii", interval: 2, quality: "minor" as const },
      { numeral: "iii", interval: 4, quality: "minor" as const },
      { numeral: "IV", interval: 5, quality: "major" as const },
      { numeral: "V", interval: 7, quality: "major" as const },
      { numeral: "vi", interval: 9, quality: "minor" as const },
      { numeral: "vii°", interval: 11, quality: "diminished" as const },
    ],
  },
  {
    id: "mixolydian",
    label: "Mixolydian",
    degrees: [
      { numeral: "I", interval: 0, quality: "major" as const },
      { numeral: "ii", interval: 2, quality: "minor" as const },
      { numeral: "iii°", interval: 3, quality: "diminished" as const },
      { numeral: "IV", interval: 5, quality: "major" as const },
      { numeral: "v", interval: 7, quality: "minor" as const },
      { numeral: "vi", interval: 9, quality: "minor" as const },
      { numeral: "VII", interval: 10, quality: "major" as const },
    ],
  },
] as const;

const MINOR_MODES = [
  {
    id: "dorian",
    label: "Dorian",
    degrees: [
      { numeral: "i", interval: 0, quality: "minor" as const },
      { numeral: "ii", interval: 2, quality: "minor" as const },
      { numeral: "III", interval: 3, quality: "major" as const },
      { numeral: "IV", interval: 5, quality: "major" as const },
      { numeral: "v", interval: 7, quality: "minor" as const },
      { numeral: "vi°", interval: 9, quality: "diminished" as const },
      { numeral: "VII", interval: 10, quality: "major" as const },
    ],
  },
  {
    id: "aeolian",
    label: "Aeolian",
    degrees: [
      { numeral: "i", interval: 0, quality: "minor" as const },
      { numeral: "ii°", interval: 2, quality: "diminished" as const },
      { numeral: "III", interval: 3, quality: "major" as const },
      { numeral: "iv", interval: 5, quality: "minor" as const },
      { numeral: "v", interval: 7, quality: "minor" as const },
      { numeral: "VI", interval: 8, quality: "major" as const },
      { numeral: "VII", interval: 10, quality: "major" as const },
    ],
  },
] as const;

type ModeId =
  | (typeof MAJOR_MODES)[number]["id"]
  | (typeof MINOR_MODES)[number]["id"];

type ModeDefinition = {
  id: ModeId;
  label: string;
  degrees: readonly {
    numeral: string;
    interval: number;
    quality: ChordQuality;
  }[];
};

const ALL_MODES: ModeDefinition[] = [...MAJOR_MODES, ...MINOR_MODES];

function getModeById(modeId: ModeId): ModeDefinition {
  return ALL_MODES.find((mode) => mode.id === modeId) ?? MAJOR_MODES[0];
}

function isMinorModeFamily(modeId: ModeId): boolean {
  return MINOR_MODES.some((mode) => mode.id === modeId);
}

const SEGMENTS: SegmentEntry[] = [
  { index: 0, major: noteLabel("C"), minor: noteLabel("A") },
  { index: 1, major: noteLabel("C#", "Db"), minor: noteLabel("A#", "Bb") },
  { index: 2, major: noteLabel("D"), minor: noteLabel("B") },
  { index: 3, major: noteLabel("D#", "Eb"), minor: noteLabel("C") },
  { index: 4, major: noteLabel("E"), minor: noteLabel("C#") },
  { index: 5, major: noteLabel("F"), minor: noteLabel("D") },
  { index: 6, major: noteLabel("F#", "Gb"), minor: noteLabel("D#", "Eb") },
  { index: 7, major: noteLabel("G"), minor: noteLabel("E") },
  { index: 8, major: noteLabel("G#", "Ab"), minor: noteLabel("F") },
  { index: 9, major: noteLabel("A"), minor: noteLabel("F#") },
  { index: 10, major: noteLabel("A#", "Bb"), minor: noteLabel("G") },
  { index: 11, major: noteLabel("B"), minor: noteLabel("G#") },
];

function buildModeSlots(modeId: ModeId): RingSlot[] {
  const slots: RingSlot[] = Array.from({ length: 12 }, () => null);
  const mode = getModeById(modeId);

  mode.degrees.forEach((degree) => {
    slots[degree.interval] = {
      numeral: degree.numeral,
      quality: degree.quality,
    };
  });

  return slots;
}

function snap(value: number) {
  return Math.round(value * 2) / 2;
}

function polar(radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return {
    x: snap(CX + radius * Math.cos(radians)),
    y: snap(CY + radius * Math.sin(radians)),
  };
}

function describeArc(innerR: number, outerR: number, startDeg: number, endDeg: number) {
  const startOuter = polar(outerR, startDeg);
  const endOuter = polar(outerR, endDeg);
  const startInner = polar(innerR, endDeg);
  const endInner = polar(innerR, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

function getContinuousRotation(current: number, newIndex: number) {
  const targetBase = -newIndex * 30;
  const delta = ((targetBase - current + 180) % 360 + 360) % 360 - 180;
  return current + delta;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const SPIN_DURATION_MS = 550;

function WheelNoteLabel({
  x,
  y,
  label,
  variant,
  isActive,
}: {
  x: number;
  y: number;
  label: NoteLabel;
  variant: "major" | "minor";
  isActive: boolean;
}) {
  const baseClass =
    variant === "major" ? styles.wheelLabelMajor : styles.wheelLabelMinor;
  const activeClass =
    variant === "major"
      ? styles.wheelLabelActiveMajor
      : styles.wheelLabelActiveMinor;
  const secondaryClass = [
    variant === "major"
      ? styles.wheelLabelMajorSecondary
      : styles.wheelLabelMinorSecondary,
    isActive ? styles.wheelLabelSecondaryActive : "",
  ]
    .filter(Boolean)
    .join(" ");
  const textClass = [baseClass, isActive ? activeClass : ""]
    .filter(Boolean)
    .join(" ");

  if (!label.secondary) {
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className={textClass}
      >
        {label.primary}
      </text>
    );
  }

  return (
    <g>
      <text
        x={x}
        y={y - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        className={textClass}
      >
        {label.primary}
      </text>
      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        dominantBaseline="middle"
        className={secondaryClass}
      >
        {label.secondary}
      </text>
    </g>
  );
}

function ChromaticStaticRing({
  slots,
  labelR,
}: {
  slots: RingSlot[];
  labelR: number;
}) {
  return (
    <g>
      {slots.map((slot, index) => {
        if (!slot) {
          return null;
        }

        const labelPoint = polar(labelR, index * 30);

        return (
          <text
            key={`static-slot-${index}`}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="central"
            className={styles.staticNumeral}
            fill={CHALK_COLORS[slot.quality]}
          >
            {slot.numeral}
          </text>
        );
      })}
    </g>
  );
}

function ModeOption({
  label,
  isSelected,
  onSelect,
}: {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.modeOption} ${
        isSelected ? styles.modeOptionSelected : styles.modeOptionUnselected
      }`}
      onClick={onSelect}
    >
      {isSelected ? (
        <svg
          className={styles.modeSketch}
          viewBox="0 0 100 22"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 8,13 C 9,7 26,5 50,5 C 76,5 91,8 92,13 C 91,18 74,21 50,21 C 24,21 9,19 8,13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {label}
    </button>
  );
}

function Instructions() {
  return (
    <div className={styles.instructions}>
      <h2 className={styles.instructionsTitle}>How to use</h2>
      <ol className={styles.instructionsList}>
        <li>Click an outer key on the wheel to select it.</li>
        <li>Pick a mode to change the chord map.</li>
        <li>
          Roman numerals show diatonic chords for that key — blue is major,
          orange is minor, red is diminished.
        </li>
      </ol>
    </div>
  );
}

function ModeSelector({
  selectedMode,
  onSelectMode,
}: {
  selectedMode: ModeId;
  onSelectMode: (modeId: ModeId) => void;
}) {
  return (
    <aside className={styles.modeSelector} aria-label="Scale mode">
      <div className={styles.modeGroup}>
        <p className={styles.modeGroupLabel}>Major</p>
        {MAJOR_MODES.map((mode) => (
          <ModeOption
            key={mode.id}
            label={mode.label}
            isSelected={selectedMode === mode.id}
            onSelect={() => onSelectMode(mode.id)}
          />
        ))}
      </div>
      <div className={styles.modeGroup}>
        <p className={styles.modeGroupLabel}>Minor</p>
        {MINOR_MODES.map((mode) => (
          <ModeOption
            key={mode.id}
            label={mode.label}
            isSelected={selectedMode === mode.id}
            onSelect={() => onSelectMode(mode.id)}
          />
        ))}
      </div>
    </aside>
  );
}

export default function ProgressionFinderPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMode, setSelectedMode] = useState<ModeId>("ionian");
  const [wheelRotation, setWheelRotation] = useState(0);
  const wheelRotationRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const minorModeFamily = isMinorModeFamily(selectedMode);

  const modeSlots = useMemo(() => buildModeSlots(selectedMode), [selectedMode]);

  const segmentLabels = useMemo(() => {
    const majorRadius = (WHEEL_OUTER_R + WHEEL_SPLIT_R) / 2;
    const minorRadius = (WHEEL_INNER_R + WHEEL_SPLIT_R) / 2;

    return SEGMENTS.map((segment) => {
      const worldAngle = segment.index * 30 + wheelRotation;
      return {
        index: segment.index,
        isActive: segment.index === selectedIndex,
        majorPoint: polar(majorRadius, worldAngle),
        minorPoint: polar(minorRadius, worldAngle),
        major: segment.major,
        minor: segment.minor,
      };
    });
  }, [wheelRotation, selectedIndex]);

  const selectSegment = useCallback((index: number) => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    const from = wheelRotationRef.current;
    const to = getContinuousRotation(from, index);
    const start = performance.now();

    setSelectedIndex(index);

    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / SPIN_DURATION_MS);
      const next = from + (to - from) * easeInOutCubic(progress);
      wheelRotationRef.current = next;
      setWheelRotation(next);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        wheelRotationRef.current = to;
        setWheelRotation(to);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  return (
    <>
      <div className={styles.wheelPage}>
      <div className={styles.wheelTexture} aria-hidden="true" />

      <div className={styles.wheelBackLink}>
        <Link
          href="/guitar"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 font-body text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground"
        >
          Back to Guitar Hub
        </Link>
      </div>

      <div className={styles.wheelContent}>
        <div className={styles.wheelColumn}>
          <div className={styles.wheelWrap}>
        <svg
          viewBox="0 0 500 500"
          className={styles.wheelSvg}
          role="img"
          aria-label="Progression Finder wheel"
        >
          <circle className={styles.ringDivider} cx={CX} cy={CY} r={OUTER_RING_INNER - 4} />

          <ChromaticStaticRing slots={modeSlots} labelR={OUTER_RING_LABEL_R} />

          <g
            className={styles.spinner}
            style={{ transform: `rotate(${wheelRotation}deg)` }}
          >
            <circle
              className={styles.splitDivider}
              cx={CX}
              cy={CY}
              r={WHEEL_SPLIT_R}
            />

            {SEGMENTS.map((segment) => {
              const startDeg = segment.index * 30 - SEGMENT_HALF_WIDTH;
              const endDeg = segment.index * 30 + SEGMENT_HALF_WIDTH;
              const isActive = segment.index === selectedIndex;

              const outerClass = minorModeFamily
                ? isActive
                  ? styles.segmentMinorActive
                  : styles.segmentMinorMuted
                : isActive
                  ? styles.segmentMajorActive
                  : styles.segmentMajorMuted;
              const innerClass = minorModeFamily
                ? styles.segmentMajorMuted
                : styles.segmentMinorMuted;

              return (
                <g key={`segment-${segment.index}`}>
                  <path
                    d={describeArc(WHEEL_SPLIT_R, WHEEL_OUTER_R, startDeg, endDeg)}
                    className={`${styles.segment} ${styles.segmentOuter} ${outerClass}`}
                    strokeWidth={SEGMENT_GAP_STROKE}
                    onClick={() => selectSegment(segment.index)}
                  />
                  <path
                    d={describeArc(WHEEL_INNER_R, WHEEL_SPLIT_R, startDeg, endDeg)}
                    className={`${styles.segment} ${styles.segmentInner} ${innerClass}`}
                    strokeWidth={SEGMENT_GAP_STROKE}
                  />
                </g>
              );
            })}
          </g>

          <g className={styles.wheelLabels}>
            {segmentLabels.map((label) => (
              <g key={`labels-${label.index}`}>
                <WheelNoteLabel
                  x={label.majorPoint.x}
                  y={label.majorPoint.y}
                  label={minorModeFamily ? label.minor : label.major}
                  variant={minorModeFamily ? "minor" : "major"}
                  isActive={label.isActive}
                />
                <WheelNoteLabel
                  x={label.minorPoint.x}
                  y={label.minorPoint.y}
                  label={minorModeFamily ? label.major : label.minor}
                  variant={minorModeFamily ? "major" : "minor"}
                  isActive={false}
                />
              </g>
            ))}
          </g>
        </svg>
          </div>

          <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotMajor}`} />
          Major
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotMinor}`} />
          Minor
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotDim}`} />
          Dim
        </span>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <Instructions />
          <ModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />
        </aside>
      </div>
    </div>
    <AppFooter />
    </>
  );
}
