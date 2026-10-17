import { recognizeIngredients } from '../OcrService';

jest.mock('@react-native-ml-kit/text-recognition', () => ({
    __esModule: true,
    default: { recognize: jest.fn() },
}));

const TextRecognition = require('@react-native-ml-kit/text-recognition').default;

describe('recognizeIngredients', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns recognized English text and blocks', async () => {
        TextRecognition.recognize.mockResolvedValue({
            text: 'Ingredients: flour, water',
            blocks: [{ text: 'Ingredients: flour, water' }],
        });

        await expect(recognizeIngredients('file:///label.jpg')).resolves.toEqual({
            status: 'success',
            text: 'Ingredients: flour, water',
        });
        expect(TextRecognition.recognize).toHaveBeenCalledWith('file:///label.jpg');
    });

    it('returns a recoverable empty result when no text is recognized', async () => {
        TextRecognition.recognize.mockResolvedValue({ text: '', blocks: [] });

        await expect(recognizeIngredients('file:///blank.jpg')).resolves.toEqual({
            status: 'empty',
            text: '',
            error: 'No readable text was found in the image.',
        });
    });

    it('returns a recoverable error when native OCR fails', async () => {
        TextRecognition.recognize.mockRejectedValue(new Error('native OCR failed'));

        await expect(recognizeIngredients('file:///label.jpg')).resolves.toEqual({
            status: 'error',
            text: '',
            error: 'native OCR failed',
        });
    });
});
