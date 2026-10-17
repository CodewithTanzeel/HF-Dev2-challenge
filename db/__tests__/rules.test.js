import { findHalalRule, getHalalRules, seedHalalRules } from '../rules';

jest.mock('expo-sqlite', () => ({
    openDatabaseSync: jest.fn(),
}));

const database = {
    runSync: jest.fn(),
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn().mockResolvedValue(null),
};

describe('offline halal rules', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('seeds rules with parameterized idempotent inserts', () => {
        seedHalalRules(database);

        expect(database.runSync).toHaveBeenCalled();
        expect(database.runSync.mock.calls[0][0]).toMatch(/ON CONFLICT\(name\) DO UPDATE/i);
        expect(database.runSync.mock.calls[0][1]).toEqual(expect.any(Array));
    });

    it('loads rules for the classifier', async () => {
        database.getAllAsync.mockResolvedValueOnce([{ name: 'gelatin', status: 'haram' }]);

        await expect(getHalalRules(database)).resolves.toEqual([
            { name: 'gelatin', status: 'haram' },
        ]);
        expect(database.getAllAsync).toHaveBeenCalledWith(expect.stringContaining('halal_rules'));
    });

    it('looks up canonical names and normalized synonyms with parameters', async () => {
        await findHalalRule(database, 'E471');

        expect(database.getFirstAsync).toHaveBeenCalledWith(
            expect.stringContaining('synonyms'),
            ['e471', '%,e471,%']
        );
    });
});
