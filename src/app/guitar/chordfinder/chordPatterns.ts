// Semitone offsets for common chord types (root = 0)
export const chordPatterns = {
  // --- Triads ---
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],

  // --- 7th chords ---
  maj7: [0, 4, 7, 11],
  dom7: [0, 4, 7, 10],
  min7: [0, 3, 7, 10],
  halfDim7: [0, 3, 6, 10], // m7♭5
  dim7: [0, 3, 6, 9],
  minMaj7: [0, 3, 7, 11],

  // --- 9th chords ---
  maj9: [0, 4, 7, 11, 14],
  dom9: [0, 4, 7, 10, 14],
  min9: [0, 3, 7, 10, 14],
  halfDim9: [0, 3, 6, 10, 14],
  dim9: [0, 3, 6, 9, 14],
  minMaj9: [0, 3, 7, 11, 14],

  // --- 11th chords ---
  maj11: [0, 4, 7, 11, 14, 17],
  dom11: [0, 4, 7, 10, 14, 17],
  min11: [0, 3, 7, 10, 14, 17],
  halfDim11: [0, 3, 6, 10, 14, 17],
  dim11: [0, 3, 6, 9, 14, 17],
  minMaj11: [0, 3, 7, 11, 14, 17],

  // --- 13th chords ---
  maj13: [0, 4, 7, 11, 14, 17, 21],
  dom13: [0, 4, 7, 10, 14, 17, 21],
  min13: [0, 3, 7, 10, 14, 17, 21],
  halfDim13: [0, 3, 6, 10, 14, 17, 21],
  dim13: [0, 3, 6, 9, 14, 17, 21],
  minMaj13: [0, 3, 7, 11, 14, 17, 21],
} as const;
