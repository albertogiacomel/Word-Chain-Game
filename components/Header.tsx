import React, { useState, useEffect } from 'react';
import Button from './Button';

interface HeaderProps {
  onRestart: () => void;
  status: string;
  isDark: boolean;
  toggleTheme: () => void;
  score: number;
}

const Header: React.FC<HeaderProps> = ({ onRestart, status, isDark, toggleTheme, score }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-neutral-900 border-b-2 border-black dark:border-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo / Title Area */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xl border-2 border-transparent">
              P
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic dark:text-white leading-none">
              Parole a <br className="sm:hidden" /><span className="text-yellow-500">Catena</span>
            </h1>
          </div>

          {/* Mobile Score (visible only on small screens next to logo) */}
          <div className="md:hidden relative">
             <div className="absolute inset-0 bg-black dark:bg-white translate-x-[2px] translate-y-[2px]"></div>
             <div className="relative bg-yellow-400 border-2 border-black dark:border-white px-2 py-0.5 min-w-[50px] text-center">
                 <span className="font-black text-xl text-black tabular-nums">{score}</span>
                 <span className="text-[8px] font-bold text-black ml-0.5">PT</span>
             </div>
          </div>
        </div>

        {/* Center Section: Status & Desktop Score */}
        <div className="flex items-center gap-6">
            {/* Status Text (Hidden on mobile to save space) */}
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Stato</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                    status === 'playing' ? 'text-green-600 dark:text-green-400' :
                    status === 'gameover' ? 'text-red-600 dark:text-red-400' :
                    status === 'victory' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-gray-600 dark:text-gray-400'
                }`}>
                    {status === 'playing' ? 'In corso' : status === 'gameover' ? 'Game Over' : status === 'victory' ? 'Vittoria' : 'Menu'}
                </span>
            </div>
            
            {/* Big Score Box (Desktop) */}
            <div className="hidden md:block relative group cursor-default" title="Punteggio attuale">
                {/* Shadow element */}
                <div className="absolute inset-0 bg-black dark:bg-white translate-x-[4px] translate-y-[4px] transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px]"></div>
                {/* Main box */}
                <div className="relative bg-yellow-300 dark:bg-yellow-500 border-2 border-black dark:border-white px-5 py-1 min-w-[100px] text-center transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
                    <div className="text-[9px] font-black text-black uppercase tracking-[0.2em] opacity-70 leading-tight mb-[-2px]">
                        Punti
                    </div>
                    <div className="flex items-baseline justify-center leading-none">
                        <span className="font-black text-4xl text-black tabular-nums tracking-tighter drop-shadow-sm">
                            {score}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              title={isDark ? "Passa a tema chiaro" : "Passa a tema scuro"}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button 
              onClick={toggleFullscreen}
              className="p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors hidden sm:block"
              title="Fullscreen"
            >
              {isFullscreen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
              )}
            </button>

            <Button variant="primary" onClick={onRestart} className="!py-2 !px-4 text-xs flex-1 md:flex-none">
                Nuova Partita
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;