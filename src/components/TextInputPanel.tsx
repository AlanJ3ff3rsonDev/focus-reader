'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReaderStore } from '@/store/readerStore';
import { tokenize, getWordCount, getEstimatedTime } from '@/lib/tokenizer';
import { extractTextFromFile, isValidPDFFile, isValidTextFile } from '@/lib/pdfParser';

export function TextInputPanel() {
  const { rawText, setText, setTokens, wpm, isPlaying, tokens, play, pause, reset } = useReaderStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = getWordCount(rawText);
  const estimatedTime = getEstimatedTime(wordCount, wpm);
  const hasText = wordCount > 0;

  // Process text when it changes
  useEffect(() => {
    if (rawText) {
      const newTokens = tokenize(rawText);
      setTokens(newTokens);
    }
  }, [rawText, setTokens]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError(null);
  }, [setText]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!isValidPDFFile(file) && !isValidTextFile(file)) {
      setError('Please use PDF or TXT files.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const text = await extractTextFromFile(file);
      setText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file.');
    } finally {
      setIsLoading(false);
    }
  }, [setText]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleToggle = () => {
    if (isPlaying) {
      pause();
    } else if (hasText) {
      play();
    }
  };

  const handleReset = () => {
    reset();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <motion.div
      className="glass-card p-6 lg:p-8 flex flex-col h-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="mb-6">
        <span className="label-tag mb-3 block">Paste your text</span>
        <p className="text-white/50 text-sm leading-relaxed">
          Paste anything, upload a file, or drag & drop. Then let the words flow at your pace.
        </p>
      </div>

      {/* Text Input Area */}
      <div
        className={`relative flex-1 mb-6 rounded-xl transition-all duration-300 ${
          isDragging
            ? 'ring-2 ring-accent-cyan/50 bg-accent-cyan/5'
            : 'bg-dark-700/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          ref={textareaRef}
          value={rawText}
          onChange={handleTextChange}
          placeholder="Paste your text here, or drag & drop a file..."
          className="w-full h-full min-h-[200px] lg:min-h-[280px] p-4 bg-transparent text-white/90 text-sm leading-relaxed rounded-xl focus:outline-none font-mono"
          disabled={isLoading}
        />

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-dark-800/90 rounded-xl border-2 border-dashed border-accent-cyan/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-accent-cyan font-medium">Drop your file here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-dark-800/90 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white/60 text-sm">Processing file...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="flex items-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-white/40">Words:</span>
          <span className="text-white font-medium tabular-nums">{wordCount.toLocaleString()}</span>
        </div>
        {hasText && (
          <div className="flex items-center gap-2">
            <span className="text-white/40">Est. time:</span>
            <span className="text-white/70 tabular-nums">{estimatedTime}</span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleToggle}
          disabled={!hasText}
          className={`btn-primary ${!hasText ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPlaying ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={handleReset}
          disabled={tokens.length === 0}
          className={`btn-control ${tokens.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Reset
        </button>

        <button
          onClick={handleUploadClick}
          className="btn-control"
          disabled={isLoading}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,.text"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <p className="text-white/30 text-xs">
          <span className="text-white/50">Tip:</span> Press{' '}
          <kbd className="px-1.5 py-0.5 bg-dark-600/50 rounded text-white/50 font-mono text-[10px]">Space</kbd>{' '}
          to start/pause,{' '}
          <kbd className="px-1.5 py-0.5 bg-dark-600/50 rounded text-white/50 font-mono text-[10px]">R</kbd>{' '}
          to reset
        </p>
      </div>
    </motion.div>
  );
}
