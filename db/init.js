import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('halal.db');

db.execSync(`
CREATE TABLE IF NOT EXISTS scans (id INTEGER PRIMARY KEY, text TEXT, created_at TIMESTAMP);
CREATE TABLE IF NOT EXISTS translations (scan_id INTEGER, language TEXT, text TEXT, FOREIGN KEY(scan_id) REFERENCES scans(id));
CREATE TABLE IF NOT EXISTS classifications (scan_id INTEGER, halal BOOLEAN, rule_applied TEXT, llm_override BOOLEAN, FOREIGN KEY(scan_id) REFERENCES scans(id));
CREATE TABLE IF NOT EXISTS halal_rules (name TEXT PRIMARY KEY, halal BOOLEAN, cert TEXT, region TEXT);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT);
CREATE TABLE IF NOT EXISTS poi (id INTEGER PRIMARY KEY, name TEXT, lat REAL, lon REAL, halal BOOLEAN, campus TEXT);
`);
