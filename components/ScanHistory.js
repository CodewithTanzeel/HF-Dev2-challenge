import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { initializeDatabase } from '../db/init';

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadScans = async () => {
      try {
        const db = initializeDatabase();
        const rows = await db.getAllAsync('SELECT * FROM scans ORDER BY created_at DESC');
        if (isMounted) setScans(rows);
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load scan history.');
      }
    };

    loadScans();
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) return <Text>Unable to load scan history: {error}</Text>;
  if (!scans.length) return <Text>No scans yet.</Text>;

  return (
    <View>
      {scans.map((scan) => (
        <Text key={scan.id}>{scan.text || 'Unnamed scan'}</Text>
      ))}
    </View>
  );
}
