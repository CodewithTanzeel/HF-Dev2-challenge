import { saveScan } from '../scans';

describe('saveScan', () => {
    it('persists scan text and classification evidence with parameters', () => {
        const database = {
            runSync: jest
                .fn()
                .mockReturnValueOnce({ lastInsertRowId: 7 })
                .mockReturnValueOnce({}),
        };

        expect(saveScan(database, {
            text: 'Ingredients: water',
            classification: {
                status: 'Halal',
                matched: [{ ingredient: 'water' }],
                unknown: [],
                reasoning: 'All recognized ingredients are classified as Halal.',
            },
        })).toBe(7);

        expect(database.runSync).toHaveBeenCalledTimes(2);
        expect(database.runSync.mock.calls[0][1]).toEqual(['Ingredients: water', expect.any(String)]);
        expect(database.runSync.mock.calls[1][1]).toEqual([7, 1, 'Halal', 'water', '', expect.any(String)]);
    });
});
