import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from './AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { COLORS } from '../../components/ui/Theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      // Handled silently for demo flow
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>Halal Scanner</Text>
            <Text style={styles.brandSubtitle}>Verify. Trust. Eat Confidently.</Text>
          </View>

          <Card>
            <Text style={styles.heading}>Log In</Text>

            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              accessibilityLabel="Email input"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
              accessibilityLabel="Password input"
            />

            <Button
              title={isLoading ? 'Signing in...' : 'Log In'}
              onPress={handleLogin}
              disabled={isLoading}
              accessibilityLabel="Log in button"
              style={styles.button}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to Halal Scanner?</Text>
              <TouchableOpacity onPress={() => navigation?.navigate?.('Signup')} accessibilityRole="button" accessibilityLabel="Go to signup">
                <Text style={styles.link}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.MINT_BG,
  },
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.DARK_GREEN,
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#558b2f',
    marginTop: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.DARK_GREEN,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f7f0',
    borderColor: '#dce5d8',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a2e1a',
    marginBottom: 14,
  },
  button: {
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    color: '#5a6e5a',
    fontSize: 14,
  },
  link: {
    color: COLORS.GREEN,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
});
