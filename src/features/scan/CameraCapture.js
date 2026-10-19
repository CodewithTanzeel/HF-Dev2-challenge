import React, { useEffect, useState, useRef } from 'react';
import { Linking, StyleSheet, Text, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { COLORS } from '../../components/ui/Theme';
import { processScan } from './processScan';

export default function CameraCapture() {
  const [photo, setPhoto] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [classification, setClassification] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const openedSettingsRef = useRef(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const permissionStatus = permission?.status || null;

  const requestCameraPermission = async () => {
    try {
      setIsRequestingPermission(true);
      setError('');
      const response = await requestPermission();
      const status = response?.status;
      if (status !== 'granted' && !openedSettingsRef.current) {
        openedSettingsRef.current = true;
        await Linking.openSettings();
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to access the camera.');
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const openCameraSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (settingsError) {
      setError(settingsError.message || 'Open your phone settings to allow camera access.');
    }
  };

  useEffect(() => {
    if (permission && !permission.granted && !openedSettingsRef.current) {
      requestCameraPermission();
    }
  }, [permission]);

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setError('');
      setIsProcessing(true);
      const { uri } = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!uri) {
        setError('Camera capture returned no image.');
        setIsProcessing(false);
        return;
      }
      setPhoto(uri);
      const result = await processScan(uri);
      setOcrText(result.ocrText || '');
      setClassification(result.classification || null);
      if (result.state !== 'complete') setError(result.error || 'Scan did not complete.');
    } catch (captureError) {
      setError(captureError?.message || 'Unable to capture the image.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (permissionStatus === null) {
    return (
      <View style={styles.centered} testID="scan-container">
        <Text>Checking camera permission...</Text>
      </View>
    );
  }

  if (permissionStatus !== 'granted') {
    return (
      <View style={styles.centered} testID="scan-container">
        <Text style={styles.permissionText}>Camera permission is required to scan ingredients.</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          title={isRequestingPermission ? 'Requesting...' : 'Try Again'}
          onPress={requestCameraPermission}
          disabled={isRequestingPermission}
          testID="try-again-btn"
        />
        <Button
          title="Open Settings"
          onPress={openCameraSettings}
          testID="open-settings-btn"
          style={styles.settingsBtn}
        />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="scan-container">
      {!photo ? (
        <View style={styles.cameraWrapper} testID="camera-view">
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            title="Capture"
            onPress={handleCapture}
            accessibilityLabel="Capture photo"
            testID="capture-btn"
            style={styles.captureBtn}
          />
        </View>
      ) : (
        <View testID="preview" style={styles.previewWrapper}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <Image source={{ uri: photo }} style={styles.previewImage} />
          </Card>
          <Text style={styles.ocrTitle}>Scan Results</Text>
          {isProcessing ? <Text style={styles.ocrText}>Analyzing ingredients...</Text> : null}
          {!isProcessing && ocrText ? <Text style={styles.ocrText}>{ocrText}</Text> : null}
          {!isProcessing && classification ? (
            <View>
              <Text style={styles.statusText}>{classification.status}</Text>
              <Text style={styles.ocrText}>{classification.reasoning}</Text>
            </View>
          ) : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            title="Scan Again"
            onPress={() => {
              setPhoto(null);
              setOcrText('');
              setClassification(null);
              setError('');
            }}
            accessibilityLabel="Scan again"
            testID="scan-again-btn"
            style={styles.resetBtn}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.MINT_BG,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.MINT_BG,
  },
  cameraWrapper: {
    flex: 1,
    width: '100%',
    minHeight: 420,
    position: 'relative',
    backgroundColor: '#111827',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  settingsBtn: {
    marginTop: 12,
    backgroundColor: COLORS.DARK_GREEN,
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
  statusText: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.DARK_GREEN,
  },
  permissionText: {
    marginBottom: 16,
    color: COLORS.DARK_GREEN,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 12,
    color: '#b91c1c',
    textAlign: 'center',
  },
  resetBtn: {
    marginTop: 24,
    borderRadius: 28,
  },
});
