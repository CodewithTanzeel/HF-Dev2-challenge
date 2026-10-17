
import * as ort from 'onnxruntime-react-native';

const MODEL_PATH = './models/gemma-2b-int4.onnx';

let session = null;

async function getSession() {
  if (!session) {
    session = await ort.InferenceSession.create(MODEL_PATH);
  }

  return session;
}

export async function translateIngredients(text) {
  const ingredients = text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const model = await getSession();

  // ONNX models require correctly shaped, typed input tensors.
  // Tokenization and input names depend on the specific model.
  throw new Error(
    `Model loaded, but inference input preparation is not implemented yet. Ingredients: ${ingredients.join(', ')}`
  );
}
