import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/features/auth/AuthContext';
import SignupWall from './src/features/auth/SignupWall';
import WaitlistScreen from './src/features/waitlist/WaitlistScreen';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <WaitlistScreen />;
  }

  return (
    <View style={styles.container}>
      <Text>Halal Scanner</Text>
      <CameraCapture />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});
