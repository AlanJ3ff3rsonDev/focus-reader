/**
 * Calculate the Optimal Recognition Point (ORP) index for a word.
 * The ORP is the character that the eye naturally focuses on when reading.
 * By highlighting this character, we help readers maintain focus and increase reading speed.
 */

export function getORPIndex(word: string): number {
  // Get the "readable" part of the word (strip leading punctuation)
  const cleanWord = word.replace(/^[^a-zA-Z0-9]*/, '');
  const leadingPunctuation = word.length - cleanWord.length;

  const len = cleanWord.length;

  let orpOffset: number;

  if (len <= 1) {
    orpOffset = 0;
  } else if (len <= 2) {
    orpOffset = 0;
  } else if (len <= 5) {
    orpOffset = 1;
  } else if (len <= 9) {
    orpOffset = 2;
  } else if (len <= 13) {
    orpOffset = 3;
  } else {
    orpOffset = 4;
  }

  // Account for leading punctuation
  return leadingPunctuation + orpOffset;
}

export interface SplitWord {
  prefix: string;
  anchor: string;
  suffix: string;
}

export function splitWordByORP(word: string, orpIndex: number): SplitWord {
  if (!word || word.length === 0) {
    return { prefix: '', anchor: '', suffix: '' };
  }

  // Clamp orpIndex to valid range
  const safeIndex = Math.min(Math.max(0, orpIndex), word.length - 1);

  return {
    prefix: word.slice(0, safeIndex),
    anchor: word[safeIndex] || '',
    suffix: word.slice(safeIndex + 1),
  };
}

/**
 * Calculate the visual offset needed to center the ORP character.
 * For monospace fonts, this is simply based on character count.
 */
export function getAlignmentOffset(word: string, orpIndex: number): number {
  // The offset is the number of characters before the ORP
  return orpIndex;
}
