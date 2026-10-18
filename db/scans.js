export function saveScan(database, { text, classification }) {
    const createdAt = new Date().toISOString();
    const scanResult = database.runSync(
        'INSERT INTO scans (text, created_at) VALUES (?, ?)',
        [text, createdAt]
    );
    const scanId = scanResult.lastInsertRowId || 1;
    const halal = classification.status === 'Halal' ? 1 : classification.status === 'Haram' ? 0 : null;
    const matched = (classification.matched || []).map((item) => item.ingredient || item).join(',');
    const unknown = (classification.unknown || []).join(',');
    const reasoning = classification.reasoning || '';
    const status = classification.status || 'Uncertain';

    database.runSync(
        `INSERT INTO classifications
      (scan_id, halal, status, matched_ingredients, unknown_ingredients, reasoning, rule_applied, llm_override)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [scanId, halal, status, matched, unknown, reasoning, classification.rule_applied || null, classification.llm_override ? 1 : 0]
    );

    return scanId;
}
