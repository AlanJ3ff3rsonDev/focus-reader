import { Token } from '@/store/readerStore';
import { getORPIndex } from './orpCalculator';

const SENTENCE_ENDINGS = /[.!?]$/;
const CLAUSE_ENDINGS = /[,;:]$/;

export function tokenize(text: string): Token[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Normalize whitespace and split
  const words = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split(/\s+/)
    .filter(word => word.length > 0);

  return words.map(word => ({
    word,
    orpIndex: getORPIndex(word),
    endsSentence: SENTENCE_ENDINGS.test(word),
    endsClause: CLAUSE_ENDINGS.test(word),
  }));
}

export function getWordCount(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

export function getEstimatedTime(wordCount: number, wpm: number): string {
  if (wordCount === 0 || wpm === 0) return '0 min';

  const totalMinutes = wordCount / wpm;

  if (totalMinutes < 1) {
    const seconds = Math.round(totalMinutes * 60);
    return `${seconds} seg`;
  }

  if (totalMinutes < 60) {
    const minutes = Math.round(totalMinutes);
    return `${minutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours}h ${minutes}m`;
}
