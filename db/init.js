import * as SQLite from 'expo-sqlite';
import { seedHalalRules } from './rules';

export const db = SQLite.openDatabaseSync('halal.db');

export function initializeDatabase() {
    db.execSync(`
		CREATE TABLE IF NOT EXISTS scans (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
		CREATE TABLE IF NOT EXISTS translations (id INTEGER PRIMARY KEY AUTOINCREMENT, scan_id INTEGER, language TEXT, text TEXT, FOREIGN KEY(scan_id) REFERENCES scans(id));
        CREATE TABLE IF NOT EXISTS classifications (id INTEGER PRIMARY KEY AUTOINCREMENT, scan_id INTEGER, halal BOOLEAN, status TEXT, matched_ingredients TEXT, unknown_ingredients TEXT, reasoning TEXT, rule_applied TEXT, llm_override BOOLEAN, FOREIGN KEY(scan_id) REFERENCES scans(id), FOREIGN KEY(scan_id) REFERENCES scans(id));
		CREATE TABLE IF NOT EXISTS halal_rules (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, halal BOOLEAN, status TEXT, synonyms TEXT, cert TEXT, region TEXT);
		CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE);
		CREATE TABLE IF NOT EXISTS poi (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, lat REAL, lon REAL, halal BOOLEAN, campus TEXT);
	`);

    for (const column of ['status TEXT', 'synonyms TEXT']) {
        try {
            db.execSync(`ALTER TABLE halal_rules ADD COLUMN ${column}`);
        } catch (error) {
            if (!/duplicate column name/i.test(error.message || '')) throw error;
        }
        for (const column of ['status TEXT', 'matched_ingredients TEXT', 'unknown_ingredients TEXT', 'reasoning TEXT']) {
            try {
                db.execSync(`ALTER TABLE classifications ADD COLUMN ${column}`);
            } catch (error) {
                if (!/duplicate column name/i.test(error.message || '')) throw error;
            }
        }
    }

    seedHalalRules(db);

    return db;
}
