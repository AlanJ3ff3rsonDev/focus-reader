'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReaderStore } from '@/store/readerStore';
import { useRSVPEngine } from '@/hooks/useRSVPEngine';
import { splitWordByORP } from '@/lib/orpCalculator';
import { SpeedDial } from './SpeedDial';

export function FocusDisplay() {
  const { tokens, currentIndex, isPlaying, wordsRead } = useReaderStore();
  const { currentToken, progress, isComplete } = useRSVPEngine();

  const totalWords = tokens.length;
  const progressPercent = Math.round(progress);

  // Split the current word for ORP rendering
  const wordParts = useMemo(() => {
    if (!currentToken) {
      return { prefix: '', anchor: '', suffix: '', offsetCh: 0 };
    }

    const parts = splitWordByORP(currentToken.word, currentToken.orpIndex);
    const totalLength = currentToken.word.length;

    // Calculate offset to center the ORP letter
    // The word is already centered by flexbox, so we need to calculate
    // how much to shift based on ORP position vs word center
    const wordCenter = totalLength / 2;
    const orpCenter = parts.prefix.length + 0.5;

    // Positive = move right, Negative = move left
    const offsetCh = wordCenter - orpCenter;

    return { ...parts, offsetCh };
  }, [currentToken]);

  const hasStarted = tokens.length > 0;
  const showPlaceholder = !hasStarted || (!currentToken && !isComplete);

  return (
    <motion.div
      className="glass-card p-6 lg:p-8 flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Stats header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div>
            <span className="label-tag block mb-1">Words</span>
            <span className="text-xl font-bold text-white tabular-nums">
              {totalWords.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="label-tag block mb-1">Progress</span>
            <span className="text-xl font-bold text-white tabular-nums">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Playing indicator */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 bg-accent-cyan/10 rounded-full border border-accent-cyan/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
              <span className="text-accent-cyan text-xs font-medium uppercase tracking-wider">Playing</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main display area */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px] lg:min-h-[280px]">
        {/* Vertical guide line */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-24 lg:h-32"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(79, 209, 197, 0.4) 50%, transparent 100%)',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
          }}
        />

        {/* Word display */}
        <div className="relative z-10 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {showPlaceholder ? (
              <motion.div
                key="placeholder"
                className="text-white/20 text-lg lg:text-xl font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isComplete ? 'Complete!' : 'Ready to read...'}
              </motion.div>
            ) : (
              <motion.div
                key={`word-${currentIndex}`}
                className="font-mono text-4xl lg:text-5xl xl:text-6xl tracking-wide flex items-center"
                style={{
                  // Shift word so ORP letter aligns with center guide
                  transform: `translateX(${wordParts.offsetCh}ch)`,
                }}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.05, ease: 'easeOut' }}
              >
                {/* Prefix (before ORP) */}
                <span className="text-white/90">{wordParts.prefix}</span>

                {/* ORP anchor (red letter) */}
                <span
                  className="text-orp-red relative"
                  style={{
                    textShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  {wordParts.anchor}
                </span>

                {/* Suffix (after ORP) */}
                <span className="text-white/90">{wordParts.suffix}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        {hasStarted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-cyan/60 to-accent-cyan rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </div>

      {/* Speed dial */}
      <div className="mt-8 flex justify-center">
        <SpeedDial />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-center gap-4 text-xs text-white/30">
          <span>
            <kbd className="px-1.5 py-0.5 bg-dark-600/50 rounded text-white/50 font-mono text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-dark-600/50 rounded text-white/50 font-mono text-[10px] ml-1">↓</kbd>
            <span className="ml-1.5">Speed</span>
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-dark-600/50 rounded text-white/50 font-mono text-[10px]">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-dark-600/50 rounded text-white/50 font-mono text-[10px] ml-1">→</kbd>
            <span className="ml-1.5">Rewind/Forward</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
