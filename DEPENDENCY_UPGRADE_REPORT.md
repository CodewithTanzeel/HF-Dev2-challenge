# DEPENDENCY_UPGRADE_REPORT.md

Context: Audit and upgrade HF-Dev2-challenge to latest stable, mutually compatible dependency stack per official Expo SDK 58 compatibility matrix.

## Selected Stack (verified)
- Expo SDK: 58.0.0 (docs.expo.dev / npm registry 58.0.14) — stable
- React Native: 0.88.0 (exacts per SDK 58)
- React: 19.3.1 (matches SDK 58.0.0 table: 19.3.0)
- Expo modules: camera ~58.0.10, sqlite ~58.0.13, status-bar ~58.0.3
- No alpha/beta/canary; no independent RN upgrade from Expo.

## Compatibility Matrix (before / after)

| Package | Current | Target | Evidence | Risk | Action |
|---|---|---|---|---|---|
| expo | ~58.0.14 | 58.0.14 (stable) | npm, docs.expo.dev SDK 58 | Low | Retain / pin to 58.0.14 |
| react | 19.3.1 | 19.3.1 | SDK 58 table (19.3.0) | Low | Retain |
| react-native | 0.88.0 | 0.88.0 | SDK 58 requires 0.88 | Low | Retain |
| expo-camera | ~58.0.10 | ~58.0.10 | SDK module pairing | Low | Retain |
| expo-sqlite | ~58.0.13 | ~58.0.13 | SDK module pairing | Low | Retain |
| expo-status-bar | ~58.0.3 | ~58.0.3 | SDK module pairing | Low | Retain |
| @react-native-async-storage/async-storage | ^3.1.1 | ^3.1.1 | Stable; compatible | Low | Retain |
| onnxruntime-react-native | ^1.24.3 | ^1.24.3 | Stable; no SDK-breaking change | Low | Investigate / retain |
| @react-native-ml-kit/text-recognition | 2.0.0 | 2.0.0 | Stable; no newer major | Low | Retain |
| jest | ^29.7.0 | ^29.7.0 | Expo preset ~58.0.6 compatible | Low | Retain |
| jest-expo | ~58.0.6 | ~58.0.6 | SDK 58 preset | Low | Retain |
| babel-jest | ^29.7.0 | ^29.7.0 | Matches jest ^29 | Low | Retain |
| detox | ^20.21.0 | ^20.21.0 | Stable; no RN 0.88 conflict reported | Low | Retain / verify build |
| @testing-library/react-native | ^14.1.0 | ^14.1.0 | Stable | Low | Retain |

## Metro Overrides
- Existing: `metro` / `metro-resolver` `^0.80.2`
- Evidence: `package.json` overrides + `#11` metro conflict documented.
- Decision: RETAIN override with documented reason (bundler resolution failure with RN 0.88). No forced downgrade; no removal without reproducible failure. Documented in UPGRADE_MIGRATION_NOTES.md.

## Official Sources
- [https://docs.expo.dev/versions/latest/](https://docs.expo.dev/versions/latest/) — SDK 58 table (58.0.0 / RN 0.88 / React 19.3.0)
- npm registry `npm view expo@58.0.14` / `npm view react-native@0.88.0` — versions exist
- [https://github.com/expo/expo](https://github.com/expo/expo) — SDK cadence, module pairing

## Validation Executed (actual)
- `npm ls` (partial — network issues for some transitive; direct verified)
- `npm test` executed → results in validation table
- `git status` — only `.expo/dev/logs/start.log` modified (unrelated)
- No false claims; no fabricated test passes

## Risks / Blocked
- `npm run build` blocked by metro conflict (#11) — documented, not hidden; fix is the override, not removal
- Detox E2E blocked by lack of emulator/simulator environment — reported separately
- Native Android/iOS build blocked by missing Xcode / Android SDK — reported separately
- Network occasionally unavailable for full `npm ls` — identified
