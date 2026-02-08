import { GoogleGenAI, Type } from "@google/genai";
import { WordData } from "../types";
import { searchWordsByPrefix } from "./wiktionaryService";

// Initialize AI only if API key is present to prevent runtime crashes
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL_NAME = 'gemini-3-flash-preview'; 

/**
 * Validates if a word is a real Italian word using AI (Fallback).
 */
export const validateWordExistence = async (word: string): Promise<boolean> => {
  if (!ai) {
    console.warn("AI Key missing, skipping AI validation.");
    return true;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Rispondi in formato JSON. La parola "${word}" esiste nella lingua italiana ed è una parola valida? Schema: { "exists": boolean }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exists: { type: Type.BOOLEAN },
          },
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return json.exists === true;
  } catch (error) {
    console.error("Error validating word:", error);
    return true; 
  }
};

/**
 * Generates the AI's next move using Wiktionary Search.
 * Returns a word starting with the last N letters of the previous word.
 */
export const generateAiMove = async (history: WordData[], lastWord: string, difficulty: number): Promise<string | null> => {
  const suffix = lastWord.slice(-difficulty).toLowerCase();
  
  console.log(`AI thinking... searching for words starting with "${suffix}" (Length: ${difficulty})`);

  // 1. Get candidates from Wiktionary
  const candidates = await searchWordsByPrefix(suffix);

  if (candidates.length === 0) {
    console.log("No candidates found on Wiktionary.");
    return null; // Surrender
  }

  // 2. Filter out words already used in history
  const usedWords = new Set(history.map(h => h.text.toLowerCase()));
  const availableWords = candidates.filter(word => !usedWords.has(word));

  if (availableWords.length === 0) {
     console.log("All candidates have been used.");
     return null; // Surrender
  }

  // 3. Pick a random word from the available list
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const selectedWord = availableWords[randomIndex];

  console.log(`AI selected: ${selectedWord}`);
  return selectedWord;
};