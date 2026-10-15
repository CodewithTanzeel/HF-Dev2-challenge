import { runInference } from 'react-native-onnxruntime';

const MODEL_PATH = './models/gemma-2b-int4.onnx';

export async function translateIngredients(text) {
  const ingredients = text.split(',').map(s => s.trim());
  const result = await runInference(MODEL_PATH, ingredients.join(', '));
  return result;
}
