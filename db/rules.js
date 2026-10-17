import { HALAL_RULES } from './halalRules';
import { normalizeIngredient } from '../src/features/scan/ingredientText';

export function seedHalalRules(database, rules = HALAL_RULES) {
    rules.forEach((rule) => {
        const name = normalizeIngredient(rule.name);
        const synonyms = (rule.synonyms || []).map(normalizeIngredient).filter(Boolean);
        database.runSync(
            `INSERT INTO halal_rules (name, halal, status, synonyms, cert, region)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(name) DO UPDATE SET
                 halal = excluded.halal,
                 status = excluded.status,
                 synonyms = excluded.synonyms,
                 cert = excluded.cert,
                 region = excluded.region`,
            [
                name,
                rule.halal,
                rule.status,
                synonyms.join(','),
                rule.cert || null,
                rule.region || null,
            ]
        );
    });
}

export function getHalalRules(database) {
    return database.getAllAsync(
        'SELECT name, halal, status, synonyms, cert, region FROM halal_rules'
    );
}

export function findHalalRule(database, name) {
    const normalizedName = normalizeIngredient(name);
    return database.getFirstAsync(
        `SELECT name, halal, status, synonyms, cert, region
         FROM halal_rules
         WHERE name = ? OR (',' || synonyms || ',') LIKE ?`,
        [normalizedName, `%,${normalizedName},%`]
    );
}
