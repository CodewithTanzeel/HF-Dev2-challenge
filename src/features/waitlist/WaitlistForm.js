import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../components/ui/Theme';

export default function WaitlistForm({ onSubmit, loading, error, success }) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const showEmailError = emailTouched && !isEmailValid && email.length > 0;

  const handlePress = () => {
    setEmailTouched(true);
    if (!isEmailValid) return;
    onSubmit({ email: email.trim().toLowerCase(), displayName: displayName.trim() || null });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.headline}>Coming Soon</Text>
          <Text style={styles.subHeadline}>Halal Scanner — verify ingredients with offline OCR, SQLite rules, and camera capture.</Text>
        </View>

        <View style={styles.formContainer}>
          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>You're on the list! Welcome to the waitlist.</Text>
            </View>
          ) : (
            <>
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Text style={styles.description}>
                Join early for first access and updates on launch. No spam — unsubscribe anytime.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[styles.input, showEmailError && styles.inputError]}
                  placeholder="you@example.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setEmailTouched(true)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  accessibilityLabel="Email for waitlist"
                  testID="waitlist-email"
                />
                {showEmailError ? <Text style={styles.validationText}>Please enter a valid email.</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Display Name (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your first name"
                  placeholderTextColor="#9ca3af"
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  accessibilityLabel="Optional display name"
                  testID="waitlist-name"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, (!isEmailValid || loading) && styles.buttonDisabled]}
                onPress={handlePress}
                disabled={!isEmailValid || loading}
                activeOpacity={0.8}
                accessibilityLabel="Join the waitlist"
                testID="waitlist-join-btn"
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" testID="waitlist-loading" />
                ) : (
                  <Text style={styles.buttonText}>Join the Waitlist</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MINT_BG,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.DARK_GREEN,
    marginBottom: 8,
  },
  subHeadline: {
    fontSize: 16,
    color: '#166534',
    textAlign: 'center',
    lineHeight: 24,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  errorContainer: {
    backgroundColor: COLORS.ERROR_BG,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.ERROR_BORDER,
  },
  errorText: {
    color: COLORS.ERROR_TEXT,
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  successText: {
    color: '#14532d',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.INPUT_BG,
    borderWidth: 1,
    borderColor: COLORS.INPUT_BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  inputError: {
    borderColor: '#f87171',
  },
  validationText: {
    color: '#b91c1c',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.GREEN,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
