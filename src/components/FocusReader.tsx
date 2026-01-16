'use client';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { TextInputPanel } from './TextInputPanel';
import { FocusDisplay } from './FocusDisplay';

export function FocusReader() {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <span className="label-tag mb-2 block">Treinador de Leitura Dinâmica</span>
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Focus Reader
              </h1>
              <p className="mt-2 text-white/50 text-sm lg:text-base max-w-md">
                Cole qualquer texto, fixe o olhar na letra vermelha e deixe as palavras fluírem no seu ritmo.
              </p>
            </div>

            {/* Privacy badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-dark-700/50 rounded-full border border-white/[0.06]">
              <svg className="w-3.5 h-3.5 text-accent-cyan/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-white/40 text-xs">100% Local</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 lg:px-12 pb-8 lg:pb-12">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full min-h-[600px]">
            {/* Left panel - Text input */}
            <TextInputPanel />

            {/* Right panel - Focus display */}
            <FocusDisplay />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-4 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/30">
          <span>Seu texto é processado localmente no seu navegador</span>
          <span className="hidden sm:inline">Desenvolvido com tecnologia RSVP</span>
        </div>
      </footer>
    </div>
  );
}
