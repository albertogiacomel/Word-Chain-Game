import React, { useEffect } from 'react';
import Button from './Button';
import { WordData } from '../types';

interface WordDetailModalProps {
  wordData: WordData;
  onClose: () => void;
}

const WordDetailModal: React.FC<WordDetailModalProps> = ({ wordData, onClose }) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white p-4 bg-yellow-300 dark:bg-yellow-500">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black">
            {wordData.text}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-black dark:border-black bg-white hover:bg-red-500 hover:text-white transition-colors font-bold text-black"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-0">
          
          {/* Image Section */}
          {wordData.imageUrl && (
            <div className="w-full h-48 sm:h-64 bg-gray-100 dark:bg-neutral-800 border-b-2 border-black dark:border-white flex items-center justify-center overflow-hidden relative">
               {/* Pattern overlay for texture */}
               <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
               <img 
                src={wordData.imageUrl} 
                alt={wordData.text} 
                className="w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal"
               />
            </div>
          )}

          {/* Info Section */}
          <div className="p-6 space-y-4 text-black dark:text-white">
            <div>
              <div className="inline-block bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest mb-2">
                Definizioni
              </div>
              
              {wordData.definitions.length > 0 ? (
                <ul className="list-decimal pl-5 space-y-2 text-sm md:text-base leading-relaxed">
                  {wordData.definitions.map((def, i) => (
                    <li key={i} className="pl-1">
                      {/* Highlight the type if present (e.g. " (botanica) ") */}
                      {def.split(/(\(.*?\))/).map((part, idx) => 
                        part.startsWith('(') && part.endsWith(')') ? 
                        <span key={idx} className="font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{part}</span> : 
                        <span key={idx}>{part}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-500">Nessuna definizione testuale trovata.</p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => window.open(wordData.url, '_blank')}
                  variant="secondary"
                  fullWidth
                  className="!py-2 text-xs"
                >
                  Apri su Wiktionary ↗
                </Button>
                <Button 
                  onClick={onClose}
                  fullWidth
                  className="!py-2 text-xs"
                >
                  Chiudi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetailModal;