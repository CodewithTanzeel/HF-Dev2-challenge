# End-to-End (E2E) SQA and Testing Workflow — Complete

**Project:** Halal Scanner (React Native / Expo)  
**Status:** Finalized  
**Linked milestone:** [#1 — HF-Dev2 Project Completion](https://github.com/CodewithTanzeel/HF-Dev2-challenge/milestone/1)  
**Closes issue:** #9 ([docs] — SQA workflow documentation)  

---

## What this document covers

This file defines the complete Software Quality Assurance (SQA) and End-to-End (E2E) testing framework for the Halal Scanner app. It aligns with the rules in `CLAUDE.md` (strict ESLint, feature-based structure, CI-required tests, Dependency rules).

---

## 1. Testing layers (from smallest to largest)

| Layer | Tool | What it checks | When it runs |
|---|---|---|---|
| Unit | Jest (`jest --runInBand`) | Component logic, hooks, context, services | Every commit / PR |
| Lint / Type check | ESLint + `npm run lint` | Naming, syntax, format, imports | Every commit / PR |
| Build | `expo export` (`npm run build`) | Native prebuild, bundle exports | Every PR |
| E2E (Android) | Detox (`npm run e2e:android`) | Camera flow, OCR, classification, permissions | Nightly or manual |
| E2E (iOS) | Detox (`npm run e2e:ios`) | Same as Android on simulator | Manual / nightly |

---

## 2. E2E Test Specification (`e2e/scan.e2e.js`)

The suite runs two core flows:

1. **Happy path — camera scan:**  
   Launch app → grant camera permission → tap capture → preview appears → scan results show (Halal / Haram / Uncertain) → tap "Scan Again" to reset.

2. **Permission denial recovery:**  
   Deny camera permission → verify error/retry UI appears → tap retry → permission granted → camera view restored.

Both flows rely on elements tagged with `testID` / `accessibilityLabel` in the UI components (`ScanHistory.js`, `CameraCapture.js`).

---

## 3. CI Pipeline (`.github/workflows/ci.yml`)

The workflow runs in this order:

```yaml
jobs:
  lint-and-test:
    - npm ci          # exact lockfile install (CLAUDE.md rule #3)
    - npm run lint    # must pass
    - npm test        # unit tests must pass
    - npm run build   # must export cleanly
  e2e-nightly:
    - needs: lint-and-test
    - runs Detox for Android emulator (nightly only)
```

**Why it fails right now (and the fix):**  
The CI runs `npm run lint` and `npm run build`. These scripts were missing from `package.json`. PR #11 (`fix/ci-add-lint-and-build`) adds them. Once merged, the `lint-and-test` job will complete instead of erroring out.

---

## 4. Manual Device Validation Protocol

When testing on a real phone (Expo Go or `expo run:android` / `expo run:ios`):

1. **Airplane Mode Test** — disable Wi-Fi / mobile data. Confirm `@react-native-ml-kit/text-recognition` (offline OCR) and SQLite rules (`db/halalRules.js`) still classify correctly.
2. **Permission Recovery** — revoke camera in device settings, relaunch, verify retry flow.
3. **Classification Edge Cases:**
   - *Clearly Haram*: "pork gelatin", "alcohol" → **Haram**
   - *Unknown Additive*: unknown E-numbers → **Uncertain** (never silently Halal)
   - *Clearly Halal*: "water, sugar, salt" → **Halal**
4. **Persistence & History** — verify scans save to SQLite (`expo-sqlite`) and display in `ScanHistory.js`.

---

## 5. Dependency & Lockfile Rules (from `CLAUDE.md`)

- `npm ci` is required in CI (never `npm install`).
- Any dependency update (e.g., `expo` 57 → 58, `react` 19.2.3 → 19.3.1) must be reflected in `package-lock.json`.
- PR descriptions must explain updates and end with:  
  `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
- Commit messages include:  
  `Co-Authored-By: Claude Code <noreply@anthropic.com>`

---

## 6. Open / Related Work

- **#1 [frontend]** AuthContext refresh token — PR #10  
- **#5 [build]** Dependency / CI scripts — PR #11  
- **#6 [build]** Expo dev build / phone connection  
- **#7 [testing]** Detox E2E smoke tests  
- **#8 [testing]** Unit test coverage for auth + scan  

---

Created by: Claude Code  
Date: 2026-10-18  
Updated: 2026-10-19 (finalized)  

🤖 Generated with [Claude Code](https://claude.com/claude-code)
