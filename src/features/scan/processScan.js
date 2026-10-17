import { initializeDatabase } from '../../../db/init';
import { getHalalRules } from '../../../db/rules';
import { saveScan } from '../../../db/scans';
import { classifyIngredients } from './classification';
import { splitIngredients } from './ingredientText';
import { recognizeIngredients } from './ocr/OcrService';

const defaultDependencies = {
    recognizeIngredients,
    initializeDatabase,
    getHalalRules,
    saveScan,
};

export async function processScan(imageUri, dependencies = defaultDependencies) {
    const ocrResult = await dependencies.recognizeIngredients(imageUri);
    if (ocrResult.status !== 'success') {
        return {
            state: ocrResult.status,
            ocrText: ocrResult.text || '',
            error: ocrResult.error,
        };
    }

    const database = dependencies.initializeDatabase();
    const rules = await dependencies.getHalalRules(database);
    const classification = classifyIngredients(splitIngredients(ocrResult.text), rules);
    const scanId = await dependencies.saveScan(database, {
        text: ocrResult.text,
        classification,
    });

    return {
        state: 'complete',
        ocrText: ocrResult.text,
        classification,
        scanId,
    };
}
