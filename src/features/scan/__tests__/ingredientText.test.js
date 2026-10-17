import { normalizeIngredient, splitIngredients } from '../ingredientText';

describe('ingredient text normalization', () => {
    it('normalizes case, punctuation, parenthetical text, and whitespace', () => {
        expect(normalizeIngredient('  Mono- and Diglycerides (of vegetable origin). ')).toBe(
            'mono and diglycerides'
        );
    });

    it('splits an ingredients label and ignores the label itself', () => {
        expect(splitIngredients('Ingredients: flour, water; yeast.')).toEqual([
            'flour',
            'water',
            'yeast',
        ]);
    });

    it('ignores an OCR ingredients label without a colon', () => {
        expect(splitIngredients('INGREDIENTS\nflour, water')).toEqual(['flour', 'water']);
    });
});
