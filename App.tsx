import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Button from './components/Button';
import WordCard from './components/WordCard';
import WordDetailModal from './components/WordDetailModal';
import { GameState, ValidationResult, GameMode, WordData } from './types';
import { generateAiMove } from './services/geminiService';
import { checkWiktionary } from './services/wiktionaryService';

const App: React.FC = () => {
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply Theme Effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const [gameState, setGameState] = useState<GameState>({
    mode: 'ai',
    history: [],
    currentTurn: 'player1',
    status: 'idle',
    message: 'Seleziona una modalità per iniziare',
    loading: false,
  });

  const [inputWord, setInputWord] = useState('');
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.history]);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      status: 'idle',
      history: [],
      message: 'Seleziona una modalità per iniziare',
      loading: false,
    }));
    setInputWord('');
    setSelectedWord(null);
  };

  const startGame = (mode: GameMode) => {
    setGameState({
      mode,
      history: [],
      currentTurn: 'player1',
      status: 'playing',
      message: mode === 'ai' 
        ? 'Inizia tu! Scrivi una parola.' 
        : 'Inizia il Giocatore 1!',
      loading: false,
    });
    setInputWord('');
  };

  const validateMove = (word: string): ValidationResult => {
    const cleanWord = word.trim().toLowerCase();
    
    if (cleanWord.length < 2) {
      return { isValid: false, error: 'La parola è troppo corta.' };
    }

    // Check history (which is now objects)
    if (gameState.history.some(h => h.text === cleanWord)) {
      return { isValid: false, error: 'Parola già utilizzata!' };
    }

    if (gameState.history.length > 0) {
      const lastWord = gameState.history[gameState.history.length - 1].text;
      const suffix = lastWord.slice(-2).toLowerCase();
      if (!cleanWord.startsWith(suffix)) {
        return { isValid: false, error: `Deve iniziare con "${suffix.toUpperCase()}"` };
      }
    }

    return { isValid: true };
  };

  const handleSurrender = () => {
    if (gameState.status !== 'playing') return;

    setGameState(prev => ({
      ...prev,
      status: 'gameover',
      message: 'Hai mollato! Partita terminata.',
      history: [
        ...prev.history,
        {
          text: "MI ARRENDO!",
          author: prev.currentTurn,
          definitions: [],
          url: "",
          isSurrender: true
        }
      ]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState.status !== 'playing' || gameState.loading) return;
    
    // Prevent interaction if it's AI turn
    if (gameState.mode === 'ai' && gameState.currentTurn === 'ai') return;

    const word = inputWord.trim().toLowerCase();
    
    // 1. Basic Rules Validation
    const validation = validateMove(word);
    if (!validation.isValid) {
      setGameState(prev => ({ ...prev, message: validation.error || 'Errore' }));
      return;
    }

    setGameState(prev => ({ ...prev, loading: true, message: 'Controllo su Wiktionary...' }));

    // 2. Strict Dictionary Validation (via Wiktionary)
    const wikiResult = await checkWiktionary(word);
    
    if (!wikiResult.exists) {
       setGameState(prev => ({ ...prev, loading: false, message: `"${word}" non trovata su Wiktionary.` }));
       return;
    }

    // Success: Update History with rich data
    const newHistory = [
      ...gameState.history, 
      { 
        text: word, 
        author: gameState.currentTurn,
        definitions: wikiResult.definitions,
        url: wikiResult.url,
        imageUrl: wikiResult.imageUrl
      }
    ];
    
    // Handle Logic based on Mode
    if (gameState.mode === 'local') {
      const nextPlayer = gameState.currentTurn === 'player1' ? 'player2' : 'player1';
      setGameState({
        mode: 'local',
        history: newHistory,
        currentTurn: nextPlayer,
        status: 'playing',
        message: `Tocca al ${nextPlayer === 'player1' ? 'Giocatore 1' : 'Giocatore 2'}`,
        loading: false,
      });
      setInputWord('');
    } else {
      // AI Mode
      setGameState({
        mode: 'ai',
        history: newHistory,
        currentTurn: 'ai',
        status: 'playing',
        message: 'Turno dell\'IA...',
        loading: true,
      });
      setInputWord('');
      await handleAiTurn(newHistory, word);
    }
  };

  const handleAiTurn = async (history: any[], lastUserWord: string) => {
    const aiWordText = await generateAiMove(history, lastUserWord);

    if (!aiWordText) {
      // AI Surrenders
      setGameState(prev => ({
        ...prev,
        status: 'victory',
        message: 'L\'IA si è arresa! Hai vinto!',
        loading: false,
        currentTurn: 'player1',
        history: [
          ...prev.history,
          {
            text: "MI ARRENDO!",
            author: 'ai',
            definitions: [],
            url: "",
            isSurrender: true
          }
        ]
      }));
      return;
    }

    // Retrieve AI word definitions
    const aiWikiResult = await checkWiktionary(aiWordText);

    // AI Move Success
    setGameState(prev => ({
      ...prev,
      history: [
        ...prev.history, // Use prev.history here to be safe, though history arg is passed
        {
          text: aiWordText,
          author: 'ai',
          definitions: aiWikiResult.definitions, // Even if check fails, it returns empty array
          url: aiWikiResult.url || `https://it.wiktionary.org/wiki/${aiWordText}`,
          imageUrl: aiWikiResult.imageUrl
        }
      ],
      currentTurn: 'player1',
      status: 'playing',
      message: `IA: "${aiWordText}". Tocca a te!`,
      loading: false
    }));
  };

  const getPlaceholder = () => {
    if (gameState.status !== 'playing') return "Partita non attiva";
    if (gameState.mode === 'ai') return "Scrivi la tua parola...";
    return gameState.currentTurn === 'player1' ? "Turno Giocatore 1..." : "Turno Giocatore 2...";
  };

  return (
    <div className="min-h-screen flex flex-col font-mono text-neutral-900 dark:text-neutral-100 selection:bg-yellow-300">
      <Header 
        onRestart={resetGame} 
        status={gameState.status} 
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col gap-6">
        
        {/* Game Area Container */}
        <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden h-[70vh] transition-all duration-300">
          
          {/* Instructions / Status Banner */}
          <div className={`p-4 border-b-2 border-black dark:border-white flex items-center gap-3 transition-colors duration-300 ${
            gameState.status === 'victory' ? 'bg-yellow-300 dark:text-black' : 
            gameState.status === 'gameover' ? 'bg-red-200 dark:text-black' : 
            gameState.mode === 'local' && gameState.currentTurn === 'player2' ? 'bg-blue-100 dark:text-black' :
            'bg-gray-100 dark:bg-neutral-800'
          }`}>
             <div className={`w-3 h-3 rounded-full bg-black dark:bg-white ${gameState.loading ? 'animate-ping' : ''}`}></div>
             <p className="font-bold text-sm uppercase tracking-tight flex-1 truncate">
               {gameState.message}
             </p>
          </div>

          {/* Word Chain History OR Mode Selection */}
          <div className="flex-1 overflow-y-auto p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#404040_1px,transparent_1px)] [background-size:16px_16px] relative transition-[background-image] duration-300">
            
            {gameState.status === 'idle' && (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm z-10 space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-center mb-4">Scegli Modalità</h2>
                  <Button onClick={() => startGame('ai')} fullWidth className="max-w-xs">
                    1 vs AI
                  </Button>
                  <Button onClick={() => startGame('local')} variant="secondary" fullWidth className="max-w-xs">
                    1 vs 1 (Locale)
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-8 max-w-xs text-center">
                    Sfida l'Intelligenza Artificiale o passa il dispositivo a un amico.
                  </p>
               </div>
            )}

            {gameState.status !== 'idle' && gameState.history.length === 0 && (
              <div className="text-center text-gray-400 italic mt-10">
                La tavola è vuota. Scrivi la prima parola!
              </div>
            )}

            <div className="space-y-4">
              {gameState.history.map((wordData, index) => (
                <WordCard 
                  key={index} 
                  data={wordData} 
                  index={index} 
                  gameMode={gameState.mode} 
                  onSelect={setSelectedWord}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t-2 border-black dark:border-white bg-white dark:bg-neutral-900 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="flex gap-4">
               
               {/* Surrender Button */}
               {gameState.status === 'playing' && (
                 <button 
                  type="button" 
                  onClick={handleSurrender}
                  title="Mi arrendo"
                  className="px-3 border-2 border-black dark:border-white bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors"
                 >
                   🏳️
                 </button>
               )}

               <div className="relative flex-1">
                 {gameState.history.length > 0 && gameState.status === 'playing' && (
                   <div className="absolute -top-3 left-4 bg-yellow-300 text-black text-[10px] font-bold px-2 border border-black z-10">
                      INIZIA CON: {gameState.history[gameState.history.length - 1].text.slice(-2).toUpperCase()}
                   </div>
                 )}
                 <input
                  type="text"
                  value={inputWord}
                  onChange={(e) => setInputWord(e.target.value)}
                  // Disable if: Game not playing OR (AI Mode AND it's AI turn)
                  disabled={gameState.status !== 'playing' || (gameState.mode === 'ai' && gameState.currentTurn === 'ai') || gameState.loading}
                  placeholder={getPlaceholder()}
                  className="w-full h-12 px-4 border-2 border-black dark:border-white bg-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:bg-yellow-50 dark:focus:bg-neutral-700 font-bold uppercase placeholder:normal-case placeholder:font-normal placeholder:text-gray-400 disabled:bg-gray-100 disabled:dark:bg-neutral-800 disabled:cursor-not-allowed transition-colors"
                  autoFocus
                />
               </div>
               
               <Button 
                type="submit" 
                disabled={gameState.status !== 'playing' || !inputWord || (gameState.mode === 'ai' && gameState.currentTurn === 'ai') || gameState.loading}
                className="h-12 !px-6 sm:!px-8"
               >
                 INVIA
               </Button>
            </form>
          </div>
        </div>

        {/* Rules Summary */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center uppercase tracking-widest">
          Regole: Nessuna ripetizione • Inizia con le ultime due lettere • Valide su Wiktionary
        </div>
      </main>

      {/* Modal */}
      {selectedWord && (
        <WordDetailModal 
          wordData={selectedWord} 
          onClose={() => setSelectedWord(null)} 
        />
      )}
    </div>
  );
};

export default App;