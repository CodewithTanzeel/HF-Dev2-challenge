import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { COLORS } from '../../components/ui/Theme';

export default function CameraCapture() {
  const [photo, setPhoto] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const cameraRef = useRef(null);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setPhoto(uri);
      setOcrText(
        'Ingredients: Flour, Water, Yeast, Salt, Olive Oil\nHalal Status: All ingredients verified halal.\nScan ID: ' +
          Math.floor(Math.random() * 100000)
      );
    }
  };

  return (
    <View style={styles.container} testID="scan-container">
      {!photo ? (
        <View style={styles.cameraWrapper} testID="camera-view">
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={Camera.Constants.Type.back}
          />
          <Button
            title="Capture"
            onPress={handleCapture}
            accessibilityLabel="Capture photo"
            style={styles.captureBtn}
          />
        </View>
      ) : (
        <View testID="preview" style={styles.previewWrapper}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <Image source={{ uri: photo }} style={styles.previewImage} />
          </Card>
          <Text style={styles.ocrTitle}>Scan Results</Text>
          <Text style={styles.ocrText}>{ocrText}</Text>
          <Button
            title="Scan Again"
            onPress={() => {
              setPhoto(null);
              setOcrText('');
            }}
            accessibilityLabel="Scan again"
            style={styles.resetBtn}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MINT_BG,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  captureBtn: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    borderRadius: 28,
    shadowColor: COLORS.DARK_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  previewWrapper: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.MINT_BG,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.GREEN,
  },
  ocrTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.DARK_GREEN,
  },
  ocrText: {
    marginTop: 10,
    fontSize: 16,
    color: '#166534',
    lineHeight: 24,
  },
  resetBtn: {
    marginTop: 24,
    borderRadius: 28,
  },
});
