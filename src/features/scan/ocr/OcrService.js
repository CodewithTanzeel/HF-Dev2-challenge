import TextRecognition from '@react-native-ml-kit/text-recognition';

export async function recognizeIngredients(imageUri) {
    if (!imageUri) {
        return {
            status: 'error',
            text: '',
            error: 'No image is available for OCR.',
        };
    }

    try {
        const result = await TextRecognition.recognize(imageUri);
        const text = String(result?.text || '').trim();

        return {
            status: text ? 'success' : 'empty',
            text,
            ...(text ? {} : { error: 'No readable text was found in the image.' }),
        };
    } catch (error) {
        return {
            status: 'error',
            text: '',
            error: error.message || 'Offline OCR failed.',
        };
    }
}
