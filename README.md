# Parole a Catena (Word Chain Game)

Un videogioco di parole moderno e minimalista sviluppato con React, dove ogni parola deve iniziare con le ultime lettere della precedente. Sfida i tuoi amici o l'Intelligenza Artificiale.

## 🎮 Caratteristiche

- **Modalità 1 vs AI**: Sfida l'Intelligenza Artificiale (Google Gemini) che gioca contro di te.
- **Modalità Locale 1 vs 1**: Passa il dispositivo a un amico per sfidarlo.
- **Validazione Real-time**: Utilizza le API di Wiktionary per verificare l'esistenza delle parole italiane.
- **Definizioni e Immagini**: Clicca sulle parole giocate per visualizzare definizioni complete e immagini (se disponibili).
- **Design Curato**: Stile "Neobrutalism" con supporto nativo per Dark Mode e animazioni fluide.
- **Difficoltà Adattiva**: Scegli se giocare concatenando le ultime 2 o 3 lettere.

## 🛠 Stack Tecnologico

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini (via `@google/genai` SDK)
- **Data**: Wiktionary API (MediaWiki)
- **Deployment**: Configurato per Cloudflare Pages (Wrangler) o Vercel

## 🚀 Installazione e Avvio Locale

1. **Clona il repository**
   ```bash
   git clone <tuo-repo>
   cd word-chain-game
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura le Variabili d'Ambiente**
   Crea un file `.env` nella root del progetto. Questo serve per abilitare la modalità AI.
   ```env
   API_KEY=la_tua_chiave_api_google_gemini
   ```
   > Puoi ottenere una chiave gratuita su [Google AI Studio](https://aistudio.google.com/).

4. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```
   Apri il browser su `http://localhost:5173`.

## 📦 Deployment

### Cloudflare Pages (Consigliato)
Il progetto è già configurato con `wrangler.json`.

1. Esegui la build:
   ```bash
   npm run build
   ```
2. Effettua il deploy della cartella `dist`:
   ```bash
   npx wrangler pages deploy dist
   ```

### Vercel
Il progetto è standard Vite, quindi Vercel lo riconoscerà automaticamente.

1. Importa il progetto su Vercel.
2. Nelle impostazioni del progetto, aggiungi la variabile d'ambiente `API_KEY`.
3. Deploy.

## 📜 Regole del Gioco

1. Scrivi una parola valida in lingua italiana.
2. Il turno successivo deve iniziare con le ultime **N** lettere della parola precedente (N dipende dalla difficoltà scelta, 2 o 3).
3. Non è consentito ripetere parole già usate nella stessa partita.
4. Se un giocatore (o l'IA) non trova parole o sbaglia, può arrendersi.

---

**Nota**: Se la chiave API non viene inserita, la modalità AI sarà disabilitata, ma sarà comunque possibile giocare in modalità locale 1vs1.