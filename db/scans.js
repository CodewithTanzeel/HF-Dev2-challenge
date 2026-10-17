export function saveScan(database, { text, classification }) {
    const createdAt = new Date().toISOString();
    const scanResult = database.runSync(
        'INSERT INTO scans (text, created_at) VALUES (?, ?)',
        [text, createdAt]
    );
    const scanId = scanResult.lastInsertRowId;
    const halal = classification.status === 'Halal' ? 1 : classification.status === 'Haram' ? 0 : null;
    const matched = classification.matched.map((item) => item.ingredient).join(',');
    const unknown = classification.unknown.join(',');

    database.runSync(
        `INSERT INTO classifications
      (scan_id, halal, status, matched_ingredients, unknown_ingredients, reasoning)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [scanId, halal, classification.status, matched, unknown, classification.reasoning]
    );

    return scanId;
}
