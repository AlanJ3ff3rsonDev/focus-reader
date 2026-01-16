'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useReaderStore } from '@/store/readerStore';

// Pause durations in ms
const SENTENCE_PAUSE = 200;
const CLAUSE_PAUSE = 80;

export function useRSVPEngine() {
  const {
    tokens,
    currentIndex,
    isPlaying,
    wpm,
    nextWord,
    pause,
  } = useReaderStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(0);

  // Calculate base interval from WPM
  const getBaseInterval = useCallback(() => {
    return 60000 / wpm;
  }, [wpm]);

  // Get the delay for current word (including punctuation pauses)
  const getCurrentDelay = useCallback(() => {
    const baseInterval = getBaseInterval();
    const currentToken = tokens[currentIndex];

    if (!currentToken) return baseInterval;

    let extraDelay = 0;

    if (currentToken.endsSentence) {
      extraDelay = SENTENCE_PAUSE;
    } else if (currentToken.endsClause) {
      extraDelay = CLAUSE_PAUSE;
    }

    return baseInterval + extraDelay;
  }, [tokens, currentIndex, getBaseInterval]);

  // Clear any existing timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Schedule next word
  const scheduleNextWord = useCallback(() => {
    clearTimer();

    if (!isPlaying || currentIndex >= tokens.length) {
      return;
    }

    const delay = getCurrentDelay();

    timerRef.current = setTimeout(() => {
      lastTickRef.current = performance.now();
      nextWord();
    }, delay);
  }, [isPlaying, currentIndex, tokens.length, getCurrentDelay, nextWord, clearTimer]);

  // Main effect: schedule word progression
  useEffect(() => {
    if (isPlaying && tokens.length > 0 && currentIndex < tokens.length) {
      scheduleNextWord();
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isPlaying, currentIndex, tokens.length, wpm, scheduleNextWord, clearTimer]);

  // Stop when reaching end
  useEffect(() => {
    if (currentIndex >= tokens.length && tokens.length > 0) {
      pause();
    }
  }, [currentIndex, tokens.length, pause]);

  return {
    currentToken: tokens[currentIndex] || null,
    isComplete: tokens.length > 0 && currentIndex >= tokens.length,
    progress: tokens.length > 0 ? (currentIndex / tokens.length) * 100 : 0,
  };
}
