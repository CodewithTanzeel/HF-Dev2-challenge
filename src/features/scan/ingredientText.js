export function normalizeIngredient(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/\([^)]*\)/g, ' ')
        .replace(/&/g, ' and ')
        .replace(/[-_/]/g, ' ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function splitIngredients(text) {
    const withoutLabel = String(text || '').replace(/^\s*ingredients?\s*:?[\s\n]*/i, '');

    return withoutLabel
        .split(/[,;\n]+/)
        .map(normalizeIngredient)
        .filter(Boolean);
}
