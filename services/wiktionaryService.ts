import { WiktionaryResult } from "../types";

const API_BASE = "https://it.wiktionary.org/w/api.php";

/**
 * Checks if a specific word exists and returns its definition.
 */
export const checkWiktionary = async (word: string): Promise<WiktionaryResult> => {
  const cleanWord = word.trim().toLowerCase();
  
  // We use action=parse to get HTML for definitions.
  // We add prop=pageimages to get the main thumbnail associated with the page.
  // pithumbsize=600 requests a thumbnail up to 600px wide.
  const url = `${API_BASE}?action=parse&page=${cleanWord}&prop=text|images|pageimages&pithumbsize=600&format=json&origin=*&redirects=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error || !data.parse) {
      return { exists: false, definitions: [], url: '' };
    }

    const htmlContent = data.parse.text['*'];
    const definitions = parseDefinitions(htmlContent);
    
    // Extract image from pageimages extension if available
    let imageUrl = undefined;
    if (data.parse.thumbnail && data.parse.thumbnail.source) {
      imageUrl = data.parse.thumbnail.source;
    } 

    return {
      exists: true,
      definitions: definitions.length > 0 ? definitions : ['Definizione non trovata automaticamente.'],
      url: `https://it.wiktionary.org/wiki/${cleanWord}`,
      imageUrl
    };

  } catch (error) {
    console.error("Wiktionary API error:", error);
    return { exists: false, definitions: [], url: '' };
  }
};

/**
 * Searches for valid ITALIAN words starting with a specific prefix.
 * Uses generator=allpages combined with prop=categories to filter by language.
 */
export const searchWordsByPrefix = async (prefix: string): Promise<string[]> => {
  const cleanPrefix = prefix.toLowerCase();
  
  // Use generator=allpages to find pages starting with prefix.
  // Use prop=categories to fetch categories for these pages.
  // cllimit=max fetches all categories for the page.
  // gaplimit=100 fetches a batch of candidates.
  const url = `${API_BASE}?action=query&generator=allpages&gapprefix=${cleanPrefix}&gapnamespace=0&gaplimit=100&gapfilterredir=nonredirects&prop=categories&cllimit=max&format=json&origin=*`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.query || !data.query.pages) {
      return [];
    }

    // data.query.pages is a dictionary indexed by page ID
    const pages = Object.values(data.query.pages) as any[];

    // Filter pages that explicitly belong to Italian language categories.
    // In it.wiktionary, Italian words have categories like "Sostantivi in italiano", "Verbi in italiano", etc.
    const italianWords = pages.filter(page => {
      if (!page.categories) return false;

      const categoryTitles = page.categories.map((c: any) => c.title.toLowerCase());

      // 1. Must be Italian
      const isItalian = categoryTitles.some((t: string) => t.includes(" in italiano"));
      
      // 2. Must NOT be a verb form (conjugated verb)
      // "Voci verbali" identifies conjugated forms which are usually not allowed in standard word games.
      const isVerbForm = categoryTitles.some((t: string) => t.includes("voci verbali"));

      return isItalian && !isVerbForm;
    }).map(page => page.title);
    
    // Filter out very short words, ensure lowercase, and EXCLUDE accented words
    return italianWords
      .map(w => w.toLowerCase())
      .filter(w => w.length >= 3)
      .filter(w => !/[àèéìòù]/.test(w)) // Exclude accents
      .filter(w => !w.endsWith("he")) // Avoid words ending in 'he'
      .filter(w => /^[a-z]+$/.test(w)); // Strict: only letters a-z (no symbols, no spaces, no hyphens)

  } catch (error) {
    console.error("Wiktionary Search error:", error);
    return [];
  }
};

const parseDefinitions = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const definitions: string[] = [];
  
  // Select all ordered lists
  const lists = doc.querySelectorAll('ol');
  
  lists.forEach((ol) => {
    const items = ol.querySelectorAll('li');
    items.forEach((li) => {
      // Basic cleanup
      const text = li.innerText.trim();
      // Filter out meta-content often found in wiktionary lists
      if (text && !text.startsWith("vedi") && !text.startsWith("v.")) { 
         // Clean up multiple spaces
         definitions.push(text.replace(/\s+/g, ' '));
      }
    });
  });

  // Return top 8 definitions to be comprehensive in the modal
  return definitions.slice(0, 8);
};