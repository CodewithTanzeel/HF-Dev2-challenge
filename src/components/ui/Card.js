import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from './Theme';

export default function Card({ children, style }) {
  return (
    <View style={[styles.card, style]} accessibilityRole="summary">
      {children || null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 16,
  },
});
