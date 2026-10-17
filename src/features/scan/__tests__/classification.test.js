import { classifyIngredients } from '../classification';

describe('classifyIngredients', () => {
    const rules = [
        { name: 'gelatin', status: 'haram', synonyms: ['gelatine'] },
        { name: 'flour', status: 'halal', synonyms: [] },
        { name: 'vegetable oil', status: 'halal', synonyms: ['sunflower oil'] },
        { name: 'mono and diglycerides', status: 'uncertain', synonyms: ['e471'] },
    ];

    it('returns Haram when any ingredient is definitively Haram', () => {
        const result = classifyIngredients(['flour', 'gelatine'], rules);

        expect(result.status).toBe('Haram');
        expect(result.matched).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ ingredient: 'gelatine', status: 'haram' }),
            ])
        );
        expect(result.reasoning).toMatch(/gelatine/i);
    });

    it('returns Uncertain for unknown or context-dependent ingredients', () => {
        const result = classifyIngredients(['flour', 'e471', 'mystery additive'], rules);

        expect(result.status).toBe('Uncertain');
        expect(result.unknown).toEqual(['mystery additive']);
        expect(result.reasoning).toMatch(/uncertain/i);
        expect(result.reasoning).toMatch(/mystery additive/i);
    });

    it('returns Halal when every ingredient matches a Halal rule', () => {
        expect(classifyIngredients(['flour', 'sunflower oil'], rules).status).toBe('Halal');
    });

    it('supports the existing boolean SQLite rule shape', () => {
        expect(classifyIngredients(['water'], [{ name: 'water', halal: true }]).status).toBe('Halal');
        expect(classifyIngredients(['water'], [{ name: 'water', halal: 1 }]).status).toBe('Halal');
        expect(classifyIngredients(['water'], [{ name: 'water', halal: 'true' }]).status).toBe('Halal');
        expect(classifyIngredients(['alcohol'], [{ name: 'alcohol', halal: 0 }]).status).toBe('Haram');
        expect(classifyIngredients(['alcohol'], [{ name: 'alcohol', halal: 'false' }]).status).toBe('Haram');
    });

    it('ignores malformed rules and defaults invalid statuses to Uncertain', () => {
        expect(classifyIngredients(['water'], [null, { name: 'water', status: 'invalid' }]).status).toBe('Uncertain');
        expect(classifyIngredients(null, null).status).toBe('Uncertain');
    });

    it('gives Haram priority over Uncertain and Halal', () => {
        const result = classifyIngredients(['water', 'e471', 'alcohol'], [
            { name: 'water', halal: 1 },
            { name: 'e471', status: 'uncertain' },
            { name: 'alcohol', halal: 0 },
        ]);

        expect(result.status).toBe('Haram');
    });
});
