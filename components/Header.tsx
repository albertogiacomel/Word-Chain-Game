import {useWordUI} from '../shared/word-ui';
import {GameKitControls} from '../shared/game-kit';
import React from 'react';
import Button from './Button';

interface HeaderProps {
  onRestart: () => void;
  status: string;
  score: number;
}

const Header: React.FC<HeaderProps> = ({ onRestart, status, score }) => {
  const ui=useWordUI();
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
              {ui("Parole a")} <br className="sm:hidden" /><span className="text-yellow-500">{ui("Catena")}</span>
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
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{ui("Stato")}</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                    status === 'playing' ? 'text-green-600 dark:text-green-400' :
                    status === 'gameover' ? 'text-red-600 dark:text-red-400' :
                    status === 'victory' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-gray-600 dark:text-gray-400'
                }`}>
                    {status === 'playing' ? ui("In corso") : status === 'gameover' ? 'Game Over' : status === 'victory' ? ui("Vittoria") : ui("Menu")}
                </span>
            </div>
            
            {/* Big Score Box (Desktop) */}
            <div className="hidden md:block relative group cursor-default" title={ui("Punteggio attuale")}>
                {/* Shadow element */}
                <div className="absolute inset-0 bg-black dark:bg-white translate-x-[4px] translate-y-[4px] transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px]"></div>
                {/* Main box */}
                <div className="relative bg-yellow-300 dark:bg-yellow-500 border-2 border-black dark:border-white px-5 py-1 min-w-[100px] text-center transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
                    <div className="text-[9px] font-black text-black uppercase tracking-[0.2em] opacity-70 leading-tight mb-[-2px]">
                        {ui("Punti")}
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
            <GameKitControls gameId="word-chain" />

            <Button variant="primary" onClick={onRestart} className="!py-2 !px-4 text-xs flex-1 md:flex-none">
                {ui("Nuova Partita")}
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;