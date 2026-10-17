import { processScan } from '../processScan';

jest.mock('expo-sqlite', () => ({
    openDatabaseSync: jest.fn(),
}));

function createDependencies(ocrResult) {
    const database = {};
    return {
        recognizeIngredients: jest.fn().mockResolvedValue(ocrResult),
        initializeDatabase: jest.fn(() => database),
        getHalalRules: jest.fn().mockResolvedValue([{ name: 'water', halal: 1 }]),
        saveScan: jest.fn().mockResolvedValue(4),
    };
}

describe('processScan', () => {
    it('runs OCR, classification, and persistence after capture', async () => {
        const dependencies = createDependencies({ status: 'success', text: 'Ingredients: water' });

        await expect(processScan('file:///label.jpg', dependencies)).resolves.toMatchObject({
            state: 'complete',
            ocrText: 'Ingredients: water',
            classification: expect.objectContaining({ status: 'Halal' }),
            scanId: 4,
        });
        expect(dependencies.recognizeIngredients).toHaveBeenCalledWith('file:///label.jpg');
        expect(dependencies.saveScan).toHaveBeenCalled();
    });

    it('returns an empty state without classifying or saving', async () => {
        const dependencies = createDependencies({ status: 'empty', text: '', error: 'No text' });

        await expect(processScan('file:///blank.jpg', dependencies)).resolves.toEqual({
            state: 'empty',
            ocrText: '',
            error: 'No text',
        });
        expect(dependencies.saveScan).not.toHaveBeenCalled();
    });

    it('returns an OCR error without crashing', async () => {
        const dependencies = createDependencies({ status: 'error', text: '', error: 'OCR failed' });

        await expect(processScan('file:///bad.jpg', dependencies)).resolves.toEqual({
            state: 'error',
            ocrText: '',
            error: 'OCR failed',
        });
    });
});
