export type TriadType =
  | "major"
  | "minor"
  | "diminished"
  | "augmented"
  | "sus2"
  | "sus4";

export type SeventhType = "maj7" | "dom7" | "min7" | "minMaj7" | "dim7" | "maj6" | "min6";

export type ExtensionType =
  | "M9"
  | "m9"
  | "A9"
  | "P11"
  | "A11"
  | "M13"
  | "m13";

export type MatchLabel = "EXACT" | "NO5" | "ENHARMONIC";

export type ChordDegree = {
  note: string;
  degree: string;
  selected: boolean;
  interval: number;
  tension?: "natural" | "altered";
};

export type ChordEvaluation = {
  name: string;
  rootKey: number;
  bassKey: number;
  score: number;
  label: MatchLabel;
  triad: TriadType;
  implicit5: boolean;
  seventh: SeventhType | null;
  extensions: ExtensionType[];
  allDegrees: ChordDegree[];
  selectedDegrees: ChordDegree[];
};

export type ChordInput = {
  pitchClasses: number[];
  bassPitchClass: number;
};

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

const NATURAL_EXTENSIONS = new Set<ExtensionType>(["M9", "P11", "M13"]);
const ALTERED_EXTENSIONS = new Set<ExtensionType>(["m9", "A9", "A11", "m13"]);

const TRIAD_REQUIREMENTS: Record<
  TriadType,
  { required: number[]; fifth?: number; implicitFifth?: boolean }
> = {
  major: { required: [4], fifth: 7, implicitFifth: true },
  minor: { required: [3], fifth: 7, implicitFifth: true },
  diminished: { required: [3, 6] },
  augmented: { required: [4, 8] },
  sus2: { required: [2], fifth: 7, implicitFifth: true },
  sus4: { required: [5], fifth: 7, implicitFifth: true },
};

const SEVENTH_INTERVALS: Record<SeventhType, number> = {
  maj7: 11,
  dom7: 10,
  min7: 10,
  minMaj7: 11,
  dim7: 9,
  maj6: 9,
  min6: 9,
};

const EXTENSION_INTERVALS: Record<ExtensionType, number> = {
  m9: 1,
  M9: 2,
  A9: 3,
  P11: 5,
  A11: 6,
  m13: 8,
  M13: 9,
};

const EXTENSION_ORDER: ExtensionType[] = [
  "M9",
  "m9",
  "A9",
  "P11",
  "A11",
  "M13",
  "m13",
];

function keyToNote(key: number): string {
  return NOTE_NAMES[((key % 12) + 12) % 12] ?? "C";
}

function uniquePitchClasses(values: number[]): number[] {
  return [...new Set(values.map((value) => ((value % 12) + 12) % 12))].sort(
    (a, b) => a - b
  );
}

function intervalsFromRoot(root: number, pitchClasses: number[]): number[] {
  return uniquePitchClasses(
    pitchClasses.map((pitch) => (pitch - root + 12) % 12)
  ).filter((interval) => interval !== 0);
}

function consumeInterval(intervals: number[], target: number): number[] {
  if (!intervals.includes(target)) {
    return intervals;
  }
  const next = [...intervals];
  next.splice(next.indexOf(target), 1);
  return next;
}

function consumeIntervals(intervals: number[], targets: number[]): number[] | null {
  let next = [...intervals];
  for (const target of targets) {
    if (!next.includes(target)) {
      return null;
    }
    next.splice(next.indexOf(target), 1);
  }
  return next;
}

function detectTriad(
  intervals: number[]
): { triad: TriadType; implicit5: boolean; remaining: number[] } | null {
  for (const triad of Object.keys(TRIAD_REQUIREMENTS) as TriadType[]) {
    const rule = TRIAD_REQUIREMENTS[triad];
    const consumed = consumeIntervals(intervals, rule.required);
    if (!consumed) {
      continue;
    }

    let implicit5 = false;
    let remaining = consumed;

    if (rule.fifth !== undefined) {
      if (remaining.includes(rule.fifth)) {
        remaining = consumeInterval(remaining, rule.fifth);
      } else if (rule.implicitFifth) {
        implicit5 = true;
      } else {
        continue;
      }
    }

    return { triad, implicit5, remaining };
  }

  return null;
}

function detectSeventh(
  triad: TriadType,
  intervals: number[]
): { seventh: SeventhType | null; remaining: number[] } {
  const candidates: SeventhType[] =
    triad === "minor"
      ? ["minMaj7", "min7", "min6"]
      : triad === "diminished"
        ? ["dim7"]
        : intervals.includes(10) &&
            (intervals.includes(2) ||
              intervals.includes(1) ||
              intervals.includes(3))
          ? ["dom7", "maj7", "maj6"]
          : ["maj7", "dom7", "maj6"];

  for (const seventh of candidates) {
    const interval = SEVENTH_INTERVALS[seventh];
    if (!intervals.includes(interval)) {
      continue;
    }

    if (seventh === "dim7" && triad !== "diminished") {
      continue;
    }
    if (seventh === "min6" && triad !== "minor") {
      continue;
    }
    if (seventh === "maj6" && triad !== "major") {
      continue;
    }
    if (seventh === "dom7" && triad !== "major") {
      continue;
    }
    if (seventh === "maj7" && triad !== "major") {
      continue;
    }

    return {
      seventh,
      remaining: consumeInterval(intervals, interval),
    };
  }

  return { seventh: null, remaining: intervals };
}

function detectExtensions(intervals: number[]): {
  extensions: ExtensionType[];
  remaining: number[];
} {
  const extensions: ExtensionType[] = [];
  let remaining = [...intervals];

  for (const extension of EXTENSION_ORDER) {
    const interval = EXTENSION_INTERVALS[extension];
    if (!remaining.includes(interval)) {
      continue;
    }

    const sameDegree = extensions.find((existing) => {
      if (extension === "M9" || extension === "m9" || extension === "A9") {
        return existing === "M9" || existing === "m9" || existing === "A9";
      }
      if (extension === "P11" || extension === "A11") {
        return existing === "P11" || existing === "A11";
      }
      return existing === "M13" || existing === "m13";
    });

    if (sameDegree) {
      continue;
    }

    extensions.push(extension);
    remaining = consumeInterval(remaining, interval);
  }

  return { extensions, remaining };
}

function formatTriad(triad: TriadType): string {
  switch (triad) {
    case "major":
      return "";
    case "minor":
      return "m";
    case "diminished":
      return "dim";
    case "augmented":
      return "aug";
    case "sus2":
      return "sus2";
    case "sus4":
      return "sus4";
  }
}

function formatSeventh(
  triad: TriadType,
  seventh: SeventhType | null,
  extensions: ExtensionType[]
): string {
  if (!seventh) {
    return "";
  }

  const hasNaturalNine = extensions.includes("M9");
  const hasNaturalEleven = extensions.includes("P11");
  const hasNaturalThirteen = extensions.includes("M13");

  switch (seventh) {
    case "maj6":
      return "6";
    case "min6":
      return "6";
    case "dim7":
      return "dim7";
    case "dom7":
      if (hasNaturalThirteen) {
        return "13";
      }
      if (hasNaturalEleven) {
        return "11";
      }
      if (hasNaturalNine) {
        return "9";
      }
      return "7";
    case "maj7":
      return "maj7";
    case "min7":
      if (hasNaturalThirteen) {
        return "m13";
      }
      if (hasNaturalEleven) {
        return "m11";
      }
      if (hasNaturalNine) {
        return "m9";
      }
      return "m7";
    case "minMaj7":
      return "m(maj7)";
  }
}

function formatAlterations(extensions: ExtensionType[]): string {
  const parts: string[] = [];

  if (extensions.includes("m9")) {
    parts.push("b9");
  }
  if (extensions.includes("A9")) {
    parts.push("#9");
  }
  if (extensions.includes("A11")) {
    parts.push("#11");
  }
  if (extensions.includes("m13")) {
    parts.push("b13");
  }

  return parts.join("");
}

function formatExtensionsOnMaj7(extensions: ExtensionType[]): string {
  if (extensions.includes("M9")) {
    return "9";
  }
  if (extensions.includes("A11")) {
    return "#11";
  }
  return "";
}

function assembleChordName(
  rootKey: number,
  bassKey: number,
  triad: TriadType,
  seventh: SeventhType | null,
  extensions: ExtensionType[]
): string {
  const root = keyToNote(rootKey);
  let name = root;

  if (seventh === "maj6") {
    name += "6";
  } else if (seventh === "min6") {
    name += "m6";
  } else if (seventh === "dim7") {
    name += "dim7";
  } else if (!seventh) {
    name += formatTriad(triad);
    if (extensions.includes("M9")) {
      name += triad === "minor" ? "(add9)" : "add9";
    } else if (extensions.includes("P11")) {
      name += triad === "minor" ? "(add11)" : "add11";
    } else if (extensions.includes("M13")) {
      name += triad === "minor" ? "(add13)" : "add13";
    }
  } else if (seventh === "dom7") {
    name += formatSeventh(triad, seventh, extensions);
    name += formatAlterations(extensions);
  } else if (seventh === "min7") {
    name += formatSeventh(triad, seventh, extensions);
    name += formatAlterations(extensions);
  } else if (seventh === "maj7") {
    name += "maj7";
    name += formatExtensionsOnMaj7(extensions);
  } else if (seventh === "minMaj7") {
    name += "m(maj7)";
  } else {
    name += formatTriad(triad) + formatSeventh(triad, seventh, extensions);
  }

  if ((seventh === "maj6" || seventh === "min6") && extensions.includes("M9")) {
    name += "/9";
  }

  if (bassKey !== rootKey) {
    name += `/${keyToNote(bassKey)}`;
  }

  return name;
}

function accountedPitchClasses(
  rootKey: number,
  triad: TriadType,
  implicit5: boolean,
  seventh: SeventhType | null,
  extensions: ExtensionType[]
): Set<number> {
  const accounted = new Set<number>([rootKey]);
  const rule = TRIAD_REQUIREMENTS[triad];

  for (const interval of rule.required) {
    accounted.add((rootKey + interval) % 12);
  }

  if (rule.fifth !== undefined && !implicit5) {
    accounted.add((rootKey + rule.fifth) % 12);
  }

  if (seventh) {
    accounted.add((rootKey + SEVENTH_INTERVALS[seventh]) % 12);
  }

  for (const extension of extensions) {
    accounted.add((rootKey + EXTENSION_INTERVALS[extension]) % 12);
  }

  return accounted;
}

function intervalToDegree(interval: number): string {
  const labels: Record<number, string> = {
    0: "1",
    1: "b9",
    2: "9",
    3: "b3",
    4: "3",
    5: "11",
    6: "#11",
    7: "5",
    8: "b13",
    9: "13",
    10: "b7",
    11: "7",
  };
  return labels[interval] ?? `${interval}`;
}

function buildDegrees(
  rootKey: number,
  pitchClasses: number[],
  triad: TriadType,
  implicit5: boolean,
  seventh: SeventhType | null,
  extensions: ExtensionType[]
): ChordDegree[] {
  const degrees: ChordDegree[] = [
    {
      note: keyToNote(rootKey),
      degree: "1",
      selected: pitchClasses.includes(rootKey),
      interval: 0,
    },
  ];

  const addDegree = (interval: number, tension?: "natural" | "altered") => {
    const noteKey = (rootKey + interval) % 12;
    degrees.push({
      note: keyToNote(noteKey),
      degree: intervalToDegree(interval),
      selected: pitchClasses.includes(noteKey),
      interval,
      tension,
    });
  };

  const rule = TRIAD_REQUIREMENTS[triad];
  for (const interval of rule.required) {
    addDegree(interval);
  }
  if (rule.fifth !== undefined && !implicit5) {
    addDegree(rule.fifth);
  } else if (implicit5) {
    addDegree(rule.fifth ?? 7);
  }

  if (seventh) {
    addDegree(SEVENTH_INTERVALS[seventh]);
  }

  for (const extension of extensions) {
    const interval = EXTENSION_INTERVALS[extension];
    addDegree(
      interval,
      NATURAL_EXTENSIONS.has(extension)
        ? "natural"
        : ALTERED_EXTENSIONS.has(extension)
          ? "altered"
          : undefined
    );
  }

  return degrees;
}

function scoreInterpretation(
  pitchClasses: number[],
  rootKey: number,
  bassKey: number,
  triad: TriadType,
  implicit5: boolean,
  seventh: SeventhType | null,
  extensions: ExtensionType[],
  remaining: number[]
): number {
  let score = implicit5 ? 2 : 3;
  score += extensions.length;

  const accounted = accountedPitchClasses(
    rootKey,
    triad,
    implicit5,
    seventh,
    extensions
  );

  const unmatchedInput = pitchClasses.filter((pitch) => !accounted.has(pitch));
  score -= unmatchedInput.length;
  score -= remaining.length;

  if (rootKey === bassKey && pitchClasses.includes(bassKey)) {
    score += 1.5;
  }

  return score;
}

function interpretForRoot(
  rootKey: number,
  pitchClasses: number[],
  bassKey: number
): ChordEvaluation | null {
  const intervals = intervalsFromRoot(rootKey, pitchClasses);
  const triadResult = detectTriad(intervals);
  if (!triadResult) {
    return null;
  }

  const { triad, implicit5, remaining: afterTriad } = triadResult;
  const { seventh, remaining: afterSeventh } = detectSeventh(triad, afterTriad);
  const { extensions, remaining } = detectExtensions(afterSeventh);

  if (remaining.length > 0) {
    return null;
  }

  const accounted = accountedPitchClasses(
    rootKey,
    triad,
    implicit5,
    seventh,
    extensions
  );
  if (!pitchClasses.every((pitch) => accounted.has(pitch))) {
    return null;
  }

  const score = scoreInterpretation(
    pitchClasses,
    rootKey,
    bassKey,
    triad,
    implicit5,
    seventh,
    extensions,
    remaining
  );

  if (score <= 0) {
    return null;
  }

  const allDegrees = buildDegrees(
    rootKey,
    pitchClasses,
    triad,
    implicit5,
    seventh,
    extensions
  );

  const label: MatchLabel = remaining.length
    ? "ENHARMONIC"
    : bassKey !== rootKey
      ? "ENHARMONIC"
      : implicit5
        ? "NO5"
        : "EXACT";

  return {
    name: assembleChordName(rootKey, bassKey, triad, seventh, extensions),
    rootKey,
    bassKey,
    score,
    label,
    triad,
    implicit5,
    seventh,
    extensions,
    allDegrees,
    selectedDegrees: allDegrees.filter((degree) => degree.selected),
  };
}

function compareEvaluations(a: ChordEvaluation, b: ChordEvaluation): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  if (a.name.length !== b.name.length) {
    return a.name.length - b.name.length;
  }
  return a.name.localeCompare(b.name);
}

export function normalizeChordInput(
  notes: number[] | string[],
  bassNote?: number | string
): ChordInput {
  const toPitchClass = (note: number | string): number => {
    if (typeof note === "number") {
      return ((note % 12) + 12) % 12;
    }
    return noteNameToKey(note);
  };

  const pitchClasses = uniquePitchClasses(notes.map(toPitchClass));
  const bassPitchClass =
    bassNote === undefined
      ? pitchClasses[0] ?? 0
      : toPitchClass(bassNote);

  return { pitchClasses, bassPitchClass };
}

export function noteNameToKey(note: string): number {
  const keyMap: Record<string, number> = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };
  return keyMap[note] ?? 0;
}

export function evaluateChords(input: ChordInput): ChordEvaluation[] {
  const { pitchClasses, bassPitchClass } = input;

  if (pitchClasses.length === 0) {
    return [];
  }

  const rootCandidates = uniquePitchClasses([
    bassPitchClass,
    ...pitchClasses,
  ]);

  const interpretations = rootCandidates
    .map((rootKey) => interpretForRoot(rootKey, pitchClasses, bassPitchClass))
    .filter((value): value is ChordEvaluation => Boolean(value))
    .sort(compareEvaluations);

  const deduped: ChordEvaluation[] = [];
  const seen = new Set<string>();
  for (const interpretation of interpretations) {
    if (seen.has(interpretation.name)) {
      continue;
    }
    seen.add(interpretation.name);
    deduped.push(interpretation);
  }

  if (deduped.length === 0) {
    return [];
  }

  if (deduped.length >= 2 && deduped[0].score >= deduped[1].score + 3) {
    return [deduped[0]];
  }

  return deduped.slice(0, 3);
}

export function getDegreeTensionCategory(
  interval: number,
  evaluation: ChordEvaluation
): "natural" | "altered" | null {
  const degree = evaluation.allDegrees.find((entry) => entry.interval === interval);
  return degree?.tension ?? null;
}

export function findChordCandidates(
  keys: number[],
  bassKey?: number
): ChordEvaluation[] {
  return evaluateChords(
    normalizeChordInput(keys, bassKey ?? keys[0])
  );
}
