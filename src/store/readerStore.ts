import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Token {
  word: string;
  orpIndex: number;
  endsSentence: boolean;
  endsClause: boolean;
}

interface ReaderState {
  // Text & Tokens
  rawText: string;
  tokens: Token[];

  // Playback state
  currentIndex: number;
  isPlaying: boolean;
  wpm: number;

  // Stats
  wordsRead: number;

  // Actions
  setText: (text: string) => void;
  setTokens: (tokens: Token[]) => void;
  setCurrentIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setWpm: (wpm: number) => void;
  incrementWpm: (delta: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  rewind: (words?: number) => void;
  forward: (words?: number) => void;
  nextWord: () => void;
}

const MIN_WPM = 100;
const MAX_WPM = 1200;
const DEFAULT_WPM = 300;
const REWIND_STEP = 10;

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      // Initial state
      rawText: '',
      tokens: [],
      currentIndex: 0,
      isPlaying: false,
      wpm: DEFAULT_WPM,
      wordsRead: 0,

      // Actions
      setText: (text) => set({ rawText: text }),

      setTokens: (tokens) => set({ tokens, currentIndex: 0, wordsRead: 0 }),

      setCurrentIndex: (index) => set({ currentIndex: index, wordsRead: index }),

      setIsPlaying: (playing) => set({ isPlaying: playing }),

      setWpm: (wpm) => set({ wpm: Math.min(MAX_WPM, Math.max(MIN_WPM, wpm)) }),

      incrementWpm: (delta) => {
        const { wpm } = get();
        const newWpm = Math.min(MAX_WPM, Math.max(MIN_WPM, wpm + delta));
        set({ wpm: newWpm });
      },

      play: () => {
        const { tokens, currentIndex } = get();
        if (tokens.length > 0 && currentIndex < tokens.length) {
          set({ isPlaying: true });
        }
      },

      pause: () => set({ isPlaying: false }),

      toggle: () => {
        const { isPlaying, tokens, currentIndex } = get();
        if (isPlaying) {
          set({ isPlaying: false });
        } else if (tokens.length > 0 && currentIndex < tokens.length) {
          set({ isPlaying: true });
        }
      },

      reset: () => set({
        currentIndex: 0,
        isPlaying: false,
        wordsRead: 0
      }),

      rewind: (words = REWIND_STEP) => {
        const { currentIndex } = get();
        const newIndex = Math.max(0, currentIndex - words);
        set({ currentIndex: newIndex, wordsRead: newIndex });
      },

      forward: (words = REWIND_STEP) => {
        const { currentIndex, tokens } = get();
        const newIndex = Math.min(tokens.length - 1, currentIndex + words);
        set({ currentIndex: newIndex, wordsRead: newIndex });
      },

      nextWord: () => {
        const { currentIndex, tokens } = get();
        if (currentIndex < tokens.length - 1) {
          set({
            currentIndex: currentIndex + 1,
            wordsRead: currentIndex + 1
          });
        } else {
          set({ isPlaying: false });
        }
      },
    }),
    {
      name: 'focus-reader-storage',
      partialize: (state) => ({ wpm: state.wpm }),
    }
  )
);
