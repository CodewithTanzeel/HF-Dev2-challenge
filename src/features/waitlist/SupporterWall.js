import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { COLORS } from '../../components/ui/Theme';
import Card from '../../components/ui/Card';

export default function SupporterWall({ supporters, totalCount, loading, onRefresh }) {
  const getInitials = (name) => {
    if (!name) return 'HS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const renderItem = ({ item, index }) => {
    const name = item.display_name || 'Supporter';
    const initials = getInitials(name);
    const dateStr = item.signup_timestamp ? new Date(item.signup_timestamp).toLocaleDateString() : '';

    return (
      <View style={styles.cardWrapper} testID={`supporter-item-${item.id}`}>
        <Card style={styles.supporterCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            {dateStr ? <Text style={styles.date}>Joined {dateStr}</Text> : null}
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{index + 1}</Text>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container} testID="supporter-wall-container">
      <View style={styles.headerRow}>
        <Text style={styles.title}>Supporters Wall</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{totalCount} Registered</Text>
        </View>
      </View>

      {loading && supporters.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.GREEN} size="large" />
          <Text style={styles.loadingText}>Loading supporters...</Text>
        </View>
      ) : supporters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Be the first to join the waitlist!</Text>
        </View>
      ) : (
        <FlatList
          data={supporters}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MINT_BG,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.DARK_GREEN,
  },
  countBadge: {
    backgroundColor: COLORS.MINT_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  countText: {
    color: COLORS.DARK_GREEN,
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  supporterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.MINT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  avatarText: {
    color: COLORS.DARK_GREEN,
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  badge: {
    backgroundColor: COLORS.MINT_BG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.GREEN,
  },
  centered: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 15,
  },
});
