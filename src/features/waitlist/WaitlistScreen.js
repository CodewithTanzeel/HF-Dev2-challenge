import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, RefreshControl, ScrollView } from 'react-native';
import { COLORS } from '../../components/ui/Theme';
import WaitlistForm from './WaitlistForm';
import SupporterWall from './SupporterWall';
import { addWaitlistEntry, getWaitlistEntries, getWaitlistCount, getTotalWaitlistCount } from '../../db/waitlist';
import { initializeDatabase } from '../../db/init';

export default function WaitlistScreen() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [supporters, setSupporters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [wallLoading, setWallLoading] = useState(false);

  useEffect(() => {
    initializeDatabase();
    loadWall();
  }, []);

  const loadWall = useCallback(async () => {
    try {
      setWallLoading(true);
      const rows = getWaitlistEntries(50, 0);
      setSupporters(rows);
      setTotalCount(getWaitlistCount());
    } catch (e) {
      // Silent fail for refresh
    } finally {
      setWallLoading(false);
    }
  }, []);

  const handleSubmit = async ({ email, displayName }) => {
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await addWaitlistEntry(email, displayName || null, 1, null, null);
      setSuccess(true);
      setEmail('');
      setDisplayName('');
      await loadWall();
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="waitlist-screen">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={wallLoading} onRefresh={loadWall} />}
      >
        <View style={styles.section}>
          <WaitlistForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            success={success}
          />
        </View>
        <View style={styles.wallSection}>
          <SupporterWall
            supporters={supporters}
            totalCount={totalCount}
            loading={wallLoading}
            onRefresh={loadWall}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MINT_BG,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  wallSection: {
    marginTop: 16,
    paddingBottom: 40,
  },
});
