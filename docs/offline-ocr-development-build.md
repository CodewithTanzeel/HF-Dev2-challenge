# Offline OCR Development Build

`@react-native-ml-kit/text-recognition` is a native React Native module. It is autolinked during Expo prebuild and is not available in standard Expo Go. The package does not provide an Expo config plugin, so no additional plugin entry is required in `app.json`.

## Android

```powershell
npm install
npx expo prebuild
npm run android:dev
```

## iOS

```powershell
npm install
npx expo prebuild
npm run ios:dev
```

After installing the development build on the device, start Metro with `npx expo start --dev-client` and open the project in that development client. OCR runs on-device and does not require network access after the native build and ML Kit assets are installed.
