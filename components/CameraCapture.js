import { Camera } from 'expo-camera';
import { useState } from 'react';

export default function CameraCapture() {
  const [photo, setPhoto] = useState(null);
  // ML Kit Lite OCR: capture -> process -> text result
  // Cache: store scan result in SQLite after OCR
  return null; // placeholder
}
