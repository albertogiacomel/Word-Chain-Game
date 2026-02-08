export type Player = 'player1' | 'player2' | 'ai';
export type GameMode = 'ai' | 'local';

export interface WordData {
  text: string;
  author: Player;
  definitions: string[];
  url: string;
  imageUrl?: string;
  isSurrender?: boolean;
}

export interface GameState {
  mode: GameMode;
  history: WordData[];
  currentTurn: Player;
  status: 'idle' | 'playing' | 'gameover' | 'victory';
  message: string;
  loading: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface WiktionaryResult {
  exists: boolean;
  definitions: string[];
  url: string;
  imageUrl?: string;
}