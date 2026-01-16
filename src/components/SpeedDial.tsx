'use client';

import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReaderStore } from '@/store/readerStore';

const MIN_WPM = 100;
const MAX_WPM = 1200;

export function SpeedDial() {
  const { wpm, setWpm, isPlaying } = useReaderStore();
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate rotation angle from WPM (0-270 degrees)
  const wpmToAngle = (wpmValue: number) => {
    const normalized = (wpmValue - MIN_WPM) / (MAX_WPM - MIN_WPM);
    return normalized * 270 - 135; // -135 to 135 degrees
  };

  // Calculate WPM from rotation angle
  const angleToWpm = (angle: number) => {
    const normalized = (angle + 135) / 270;
    return Math.round((normalized * (MAX_WPM - MIN_WPM) + MIN_WPM) / 10) * 10;
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const adjustedAngle = angle + 90; // Rotate to start from top

    // Clamp to valid range
    const clampedAngle = Math.max(-135, Math.min(135, adjustedAngle));
    const newWpm = angleToWpm(clampedAngle);

    setWpm(Math.max(MIN_WPM, Math.min(MAX_WPM, newWpm)));
  }, [isDragging, setWpm]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const currentAngle = wpmToAngle(wpm);

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i <= 12; i++) {
    const angle = -135 + (i * 270) / 12;
    const isMajor = i % 3 === 0;
    ticks.push({ angle, isMajor });
  }

  return (
    <div className="flex flex-col items-center">
      {/* Dial container */}
      <div
        ref={dialRef}
        className={`relative w-36 h-36 lg:w-44 lg:h-44 rounded-full cursor-pointer select-none ${
          isPlaying ? 'animate-dial-pulse' : ''
        }`}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(79, 209, 197, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(79, 209, 197, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, rgba(22, 22, 38, 0.9) 0%, rgba(10, 10, 18, 0.95) 100%)
          `,
          boxShadow: `
            0 0 30px rgba(79, 209, 197, 0.15),
            inset 0 0 30px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: 'transparent',
            border: '1px solid rgba(79, 209, 197, 0.15)',
          }}
        />

        {/* Tick marks */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {ticks.map(({ angle, isMajor }, i) => {
            const radians = (angle - 90) * (Math.PI / 180);
            const innerRadius = isMajor ? 38 : 40;
            const outerRadius = 44;
            const x1 = 50 + innerRadius * Math.cos(radians);
            const y1 = 50 + innerRadius * Math.sin(radians);
            const x2 = 50 + outerRadius * Math.cos(radians);
            const y2 = 50 + outerRadius * Math.sin(radians);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? 'rgba(79, 209, 197, 0.6)' : 'rgba(79, 209, 197, 0.25)'}
                strokeWidth={isMajor ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}

          {/* Arc indicator */}
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(79, 209, 197, 0.1)" />
              <stop offset="100%" stopColor="rgba(79, 209, 197, 0.5)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Needle/Indicator */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 origin-bottom"
          style={{
            height: '35%',
            marginLeft: '-2px',
            marginTop: '-35%',
          }}
          animate={{ rotate: currentAngle }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'linear-gradient(to top, #4fd1c5 0%, #38b2ac 50%, transparent 100%)',
              boxShadow: '0 0 10px rgba(79, 209, 197, 0.5)',
            }}
          />
          {/* Needle tip glow */}
          <div
            className="absolute -top-1 left-1/2 w-2 h-2 -ml-1 rounded-full bg-accent-cyan"
            style={{ boxShadow: '0 0 8px rgba(79, 209, 197, 0.8)' }}
          />
        </motion.div>

        {/* Center cap */}
        <div
          className="absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(79, 209, 197, 0.3) 0%, rgba(30, 30, 50, 0.9) 100%)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        />
      </div>

      {/* WPM Label */}
      <div className="mt-6 text-center">
        <span className="label-tag block mb-1">Speed</span>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl lg:text-4xl font-bold text-white tabular-nums tracking-tight">
            {wpm}
          </span>
          <span className="text-white/40 text-sm font-medium">WPM</span>
        </div>
      </div>
    </div>
  );
}
