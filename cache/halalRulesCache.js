// In-memory cache for halal_rules (loaded once from SQLite/open data)
let ruleCache = new Map();

export function loadRules(data) { ruleCache = new Map(data); }
export function getRule(ingredient) { return ruleCache.get(ingredient) || null; }
