import { normalizeIngredient } from './ingredientText';

const STATUS_ORDER = ['haram', 'uncertain', 'halal'];

function findRule(ingredient, rules) {
    const normalizedIngredient = normalizeIngredient(ingredient);

    return rules.find((rule) => {
        if (!rule || typeof rule !== 'object' || !rule.name) return false;
        const synonyms = Array.isArray(rule.synonyms)
            ? rule.synonyms
            : String(rule.synonyms || '').split(',').filter(Boolean);
        const names = [rule.name, ...synonyms];
        return names.some((name) => normalizeIngredient(name) === normalizedIngredient);
    });
}

function getRuleStatus(rule) {
    if (typeof rule.status === 'string') {
        const status = rule.status.trim().toLowerCase();
        if (STATUS_ORDER.includes(status)) return status;
    }
    if (rule.halal === true || rule.halal === 1 || rule.halal === '1' || rule.halal === 'true') return 'halal';
    if (rule.halal === false || rule.halal === 0 || rule.halal === '0' || rule.halal === 'false') return 'haram';
    return 'uncertain';
}

export function classifyIngredients(ingredients, rules = []) {
    const matched = [];
    const unknown = [];
    const availableRules = Array.isArray(rules) ? rules : [];

    (Array.isArray(ingredients) ? ingredients : []).map(normalizeIngredient).filter(Boolean).forEach((ingredient) => {
        const rule = findRule(ingredient, availableRules);
        if (!rule) {
            unknown.push(ingredient);
            return;
        }

        matched.push({
            ingredient,
            matchedName: normalizeIngredient(rule.name),
            status: getRuleStatus(rule),
            rule,
        });
    });

    const statuses = matched.map((item) => item.status);
    const matchedStatus = STATUS_ORDER.find((candidate) => statuses.includes(candidate));
    const normalizedStatus = matchedStatus === 'haram'
        ? 'Haram'
        : unknown.length || !matchedStatus || matchedStatus === 'uncertain'
            ? 'Uncertain'
            : 'Halal';
    const haramIngredients = matched.filter((item) => item.status === 'haram').map((item) => item.ingredient);
    const uncertainIngredients = matched.filter((item) => item.status === 'uncertain').map((item) => item.ingredient);
    const reasoning = normalizedStatus === 'Haram'
        ? `Haram ingredient detected: ${haramIngredients.join(', ')}.`
        : normalizedStatus === 'Uncertain'
            ? `Classification is Uncertain because these ingredients require verification: ${[
                ...uncertainIngredients,
                ...unknown,
            ].join(', ')}.`
            : 'All recognized ingredients are classified as Halal.';

    return { status: normalizedStatus, matched, unknown, reasoning };
}
