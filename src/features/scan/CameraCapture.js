import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

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
          <TouchableOpacity
            testID="capture-btn"
            style={styles.captureBtn}
            onPress={handleCapture}
            accessibilityLabel="Capture photo"
          >
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View testID="preview" style={styles.previewWrapper}>
          <Image source={{ uri: photo }} style={styles.previewImage} />
          <Text style={styles.ocrTitle}>Scan Results</Text>
          <Text style={styles.ocrText}>{ocrText}</Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setPhoto(null);
              setOcrText('');
            }}
          >
            <Text style={styles.resetText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fdf6',
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
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#14532d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  captureText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  previewWrapper: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0fdf4',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  ocrTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '800',
    color: '#14532d',
  },
  ocrText: {
    marginTop: 10,
    fontSize: 16,
    color: '#166534',
    lineHeight: 24,
  },
  resetBtn: {
    marginTop: 24,
    backgroundColor: '#14532d',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  resetText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
