import { classifyIngredients } from '../../scan/classification';

describe('Auth + Scan Unit Tests (#8)', () => {
    describe('AuthContext logic (simulated)', () => {
        it('validates email format and password length', () => {
            const validateEmail = (text) => /@/.test(text);
            const validatePassword = (text) => text && text.length >= 6;
            expect(validateEmail('test@demo.com')).toBe(true);
            expect(validateEmail('bad')).toBe(false);
            expect(validatePassword('123456')).toBe(true);
            expect(validatePassword('12')).toBe(false);
        });
    });

    describe('Scan classification rules', () => {
        it('classifies halal, haram, and uncertain ingredients', () => {
            const rules = [
                { name: 'water', status: 'halal', halal: 1 },
                { name: 'gelatin', status: 'haram', halal: 0 },
                { name: 'e471', status: 'uncertain', halal: null },
            ];
            expect(classifyIngredients(['water'], rules).status).toBe('Halal');
            expect(classifyIngredients(['gelatin'], rules).status).toBe('Haram');
            expect(classifyIngredients(['e471'], rules).status).toBe('Uncertain');
        });
    });
});
