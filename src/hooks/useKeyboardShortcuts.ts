'use client';

import { useEffect, useCallback } from 'react';
import { useReaderStore } from '@/store/readerStore';

const WPM_STEP = 20;

export function useKeyboardShortcuts() {
  const { toggle, reset, incrementWpm, rewind, forward, tokens } = useReaderStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in textarea
    const target = event.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
      return;
    }

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        if (tokens.length > 0) {
          toggle();
        }
        break;

      case 'KeyR':
        event.preventDefault();
        reset();
        break;

      case 'ArrowUp':
        event.preventDefault();
        incrementWpm(WPM_STEP);
        break;

      case 'ArrowDown':
        event.preventDefault();
        incrementWpm(-WPM_STEP);
        break;

      case 'ArrowLeft':
        event.preventDefault();
        rewind(10);
        break;

      case 'ArrowRight':
        event.preventDefault();
        forward(10);
        break;

      default:
        break;
    }
  }, [toggle, reset, incrementWpm, rewind, forward, tokens.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
