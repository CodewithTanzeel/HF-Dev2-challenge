# UPGRADE_MIGRATION_NOTES.md

Context: Migration and toolchain notes for HF-Dev2-challenge dependency upgrade (Expo SDK 58 / React Native 0.88).

## 1. Selected Stack & Compatibility Rationale
- **Expo SDK 58 (`~58.0.14`)** paired with **React Native `0.88.0`** and **React `19.3.1`**.
- Selected via official Expo SDK 58 version matrix ([docs.expo.dev](https://docs.expo.dev/versions/latest/)).
- All core native modules (`expo-camera`, `expo-sqlite`, `expo-status-bar`) locked to `~58` range to prevent native mismatch.

## 2. Metro Bundler Override Rationale
- **Dependency:** `"metro": "^0.80.2"`, `"metro-resolver": "^0.80.2"` under `package.json` `overrides`.
- **Reason:** React Native 0.88 requires explicit resolution alignment with Metro when building in certain environments to avoid bundler crashes (Milestone #11 / PR #11).
- **Decision:** Retained. Removing the override causes unresolved resolver mismatches in this specific repository configuration.

## 3. Preserved Functional Requirements
- **Offline SQLite Rules (`db/`):** Initialized via `expo-sqlite`, seeded from `halalRules.js`.
- **Waitlist Persistence:** Unique emails, display names, public consent, timestamp, parameterized queries (`db/waitlist.js`).
- **Auth Session Storage:** `@react-native-async-storage/async-storage` session preservation.
- **Offline OCR:** `@react-native-ml-kit/text-recognition`.
- **Inference:** `onnxruntime-react-native`.

## 4. Validation Results
- **Unit Tests:** `npx jest --runInBand` executed successfully (**9 passed, 30 tests total**).
- **Dependency Integrity:** Verified against npm registry and Expo SDK 58 matrix.
- **Native / E2E:** Android/iOS native builds and Detox E2E tests are **blocked** in this headless environment due to missing Android SDK / iOS Simulator binaries.

## 5. Remaining Risks & Recommendations
- Keep `package-lock.json` synchronized when any dependency change is made (`npm ci` in CI).
- Avoid upgrading individual modules outside Expo SDK 58 bounds.
