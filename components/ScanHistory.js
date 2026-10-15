import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('halal.db');

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  useEffect(() => {
    db.execAsync('SELECT * FROM scans').then(r => setScans(r));
  }, []);
  return null;
}
