import { useEffect, useState } from 'react';

global.dbl; // placeholder for sqlite reference
export default function ExportScreen() {
  const [scans, setScans] = useState([]);
  useEffect(() => { /* load from SQLite for export */ }, []);
  return null;
}
