import { translateIngredients } from '../components/TranslationEngine';

export async function onScanComplete(text) {
  const translated = await translateIngredients(text);
  // Store to SQLite: scans, translations, classifications
  return translated;
}
