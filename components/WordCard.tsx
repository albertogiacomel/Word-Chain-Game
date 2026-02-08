import React from 'react';
import { WordData, GameMode } from '../types';

interface WordCardProps {
  data: WordData;
  index: number;
  gameMode: GameMode;
  onSelect: (data: WordData) => void;
}

const WordCard: React.FC<WordCardProps> = ({ data, index, gameMode, onSelect }) => {
  // Determine alignment and label based on mode
  let isRightSide = true;
  let label = "P1";

  if (gameMode === 'ai') {
    isRightSide = index % 2 === 0; // Even = Player, Odd = AI
    label = isRightSide ? "TU" : "CPU";
  } else {
    isRightSide = index % 2 === 0; // Even = P1, Odd = P2
    label = isRightSide ? "P1" : "P2";
  }

  // Handle Surrender Card Styling
  if (data.isSurrender) {
    return (
      <div className={`flex ${isRightSide ? 'justify-end' : 'justify-start'} animate-bounce`}>
        <div 
          className={`
            relative px-6 py-3 border-2 border-black dark:border-white 
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
            bg-red-500 text-white font-bold uppercase tracking-widest text-center
            transform rotate-2
          `}
        >
          <div className="text-[10px] opacity-80 mb-1">{label} HA MOLLATO</div>
          <div className="flex items-center gap-2 text-xl">
            <span>🏳️</span>
            <span>{data.text}</span>
          </div>
        </div>
      </div>
    );
  }

  const suffix = data.text.slice(-2);
  const stem = data.text.slice(0, -2);

  return (
    <div className={`flex ${isRightSide ? 'justify-end' : 'justify-start'}`}>
      <button 
        type="button"
        onClick={() => onSelect(data)}
        className={`
          relative max-w-[80%] px-4 py-2 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
          hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]
          hover:translate-x-[2px] hover:translate-y-[2px] 
          active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
          transition-all text-left group
          ${isRightSide 
            ? 'bg-black dark:bg-white text-white dark:text-black' // Right: Black(L) / White(D)
            : 'bg-white dark:bg-black text-black dark:text-white' // Left: White(L) / Black(D)
          }
        `}
      >
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] opacity-60 block mb-1 uppercase tracking-widest font-bold">
            {label}
          </span>
          {/* Search icon hint */}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
            🔍
          </span>
        </div>
        
        <span className="text-xl font-bold tracking-wide break-all">
          {stem}<span className={`${isRightSide ? 'text-yellow-300 dark:text-yellow-600' : 'text-yellow-600 dark:text-yellow-300'} underline decoration-2 underline-offset-4`}>{suffix}</span>
        </span>
      </button>
    </div>
  );
};

export default WordCard;