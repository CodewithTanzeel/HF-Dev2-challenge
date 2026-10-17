# Camera Scan Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Execute this plan task-by-task with focused validation after each task.

**Goal:** Make the Expo camera scan screen reliably testable on a device or simulator.

**Architecture:** Keep the existing `src/features/scan/CameraCapture.js` as the owner of permission, capture, preview, reset, and error state. Use a deterministic mock result until OCR and persistence are implemented in later milestones.

**Tech Stack:** Expo Camera, React Native, Jest, React Native Testing Library.

---

### Task 1: Verify runnable project configuration

**Files:** `package.json`, `package-lock.json`, `app.json`

- [ ] Confirm the dependency manifest exists and includes Expo, React Native, `expo-camera`, and test dependencies.
- [ ] If the manifest is absent in the working tree, restore the project’s intended dependency metadata without overwriting unrelated user changes.
- [ ] Confirm the Expo camera permission configuration is compatible with the installed Expo SDK.
- [ ] Run the narrowest available dependency/configuration check and record blockers.

### Task 2: Establish failing scanner tests

**Files:** Modify `src/features/scan/__tests__/CameraCapture.test.js`

- [ ] Mock `expo-camera` with a camera component exposing an async `takePictureAsync` method and a permission-request function.
- [ ] Add tests for permission request, granted camera rendering, denied recovery UI, capture-to-preview, result rendering, reset, and capture failure.
- [ ] Use `testID` selectors for `camera-view`, `capture-btn`, `preview`, and `scan-again-btn`.
- [ ] Run the focused test file and confirm failures are caused by the missing behavior.

### Task 3: Implement the camera state flow

**Files:** Modify `src/features/scan/CameraCapture.js`

- [ ] Request camera permission on mount and track the returned status.
- [ ] Render loading, denied, and ready states with accessible recovery controls.
- [ ] Capture at quality `0.8`, store the URI, and show deterministic mock result text.
- [ ] Catch capture errors, display an inline error, and preserve retryability.
- [ ] Add the required test IDs and reset behavior without introducing OCR, model, or SQLite dependencies.
- [ ] Run the focused scanner tests until green.

### Task 4: Validate the mobile slice

**Files:** No source changes unless validation exposes a local defect.

- [ ] Run the full available test command.
- [ ] Run Expo’s project validation or start check if dependencies are available.
- [ ] Report any environment blockers separately from code failures.
