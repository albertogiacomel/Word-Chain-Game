import {useGamePreferences} from './game-kit';
import {I18n} from './videogames-kit/src/index.mjs';
const english: Record<string,string> = {
  "Seleziona una modalità per iniziare": "Choose a mode to start",
  "Inizia tu! Scrivi una parola.": "You start! Enter a word.",
  "Inizia il Giocatore 1!": "Player 1 starts!",
  "Parola troppo corta.": "The word is too short.",
  "Parola già utilizzata!": "This word has already been used!",
  "Hai mollato! Partita terminata.": "You surrendered. Game over.",
  "MI ARRENDO!": "I SURRENDER!",
  "Controllo su Wiktionary...": "Checking Wiktionary...",
  "Giocatore 1": "Player 1",
  "Giocatore 2": "Player 2",
  "Turno dell'IA...": "AI turn...",
  "L'IA si è arresa! Hai vinto!": "The AI surrendered! You win!",
  "Partita non attiva": "No active game",
  "Scrivi la tua parola...": "Enter your word...",
  "Turno Giocatore 1...": "Player 1 turn...",
  "Turno Giocatore 2...": "Player 2 turn...",
  "Scegli Modalità": "Choose a mode",
  "Difficoltà (Ultime Lettere)": "Difficulty (last letters)",
  "2 Lettere": "2 letters",
  "3 Lettere": "3 letters",
  "1 vs AI": "1 vs AI",
  "1 vs 1 (Locale)": "1 vs 1 (local)",
  "Regola Principale": "Main rule",
  "La parola successiva deve iniziare con le": "The next word must start with the",
  "ULTIME": "LAST",
  "LETTERE": "LETTERS",
  "della parola precedente.": "of the previous word.",
  "La tavola è vuota. Scrivi la prima parola!": "The board is empty. Enter the first word!",
  "Mi arrendo": "Surrender",
  "INIZIA CON:": "START WITH:",
  "INVIA": "SEND",
  "Regole: Nessuna ripetizione • Inizia con le ultime": "Rules: no repetitions • Start with the last",
  "lettere": "letters",
  "Dati forniti da Wiktionary": "Data provided by Wiktionary",
  "Parole a": "Word",
  "Catena": "Chain",
  "Stato": "Status",
  "In corso": "Playing",
  "Punteggio attuale": "Current score",
  "Punti": "Points",
  "Nuova Partita": "New game",
  "HA MOLLATO": "SURRENDERED",
  "Definizioni": "Definitions",
  "Nessuna definizione testuale trovata.": "No text definition found.",
  "Apri su Wiktionary ↗": "Open on Wiktionary ↗",
  "Chiudi": "Close",
  "Vittoria": "Victory",
  "Menu": "Menu",
  "TU": "YOU",
  "Errore": "Error",
  "Tocca al {player}": "{player}: your turn!",
  "\"{word}\" non trovata su Wiktionary.": "\"{word}\" was not found on Wiktionary.",
  "Deve iniziare con \"{prefix}\"": "It must start with \"{prefix}\"",
  "IA: \"{word}\". Tocca a te!": "AI: \"{word}\". Your turn!"
};
const italian=Object.fromEntries(Object.keys(english).map(key=>[key,key]));
export function useWordUI(){
 const {preferences}=useGamePreferences('word-chain');
 const i18n=new I18n({it:italian,en:english},{language:preferences.language});
 return (text:string)=>{
  let match=text.match(/^Deve iniziare con "([^"]+)"$/);
  if(match)return i18n.t('Deve iniziare con "{prefix}"',{prefix:match[1]});
  match=text.match(/^IA: "([^"]+)"\. Tocca a te!$/);
  if(match)return i18n.t('IA: "{word}". Tocca a te!',{word:match[1]});
  match=text.match(/^Tocca al (Giocatore [12])$/);
  if(match)return i18n.t('Tocca al {player}',{player:i18n.t(match[1])});
  match=text.match(/^"([^"]+)" non trovata su Wiktionary\.$/);
  if(match)return i18n.t('"{word}" non trovata su Wiktionary.',{word:match[1]});
  return i18n.t(text);
 };
}
