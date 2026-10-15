import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CameraCapture from './components/CameraCapture';
import { translateIngredients } from './components/TranslationEngine';
import ScanHistory from './components/ScanHistory';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Halal Scanner</Text>
      <CameraCapture />
      <ScanHistory />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
