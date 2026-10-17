# Camera Scan Flow Design

**Date:** 2026-10-17
**Scope:** First mobile milestone for the Expo app

## Goal

Make the existing camera feature reliable to test on a physical Expo device or simulator before adding OCR, translation, halal classification, or SQLite persistence.

## User Flow

1. The scan screen requests camera permission when it mounts.
2. While permission is being checked, the screen shows a loading state.
3. With permission granted, the screen shows the rear camera and a Capture control.
4. Capture takes a photo at quality `0.8` and shows a preview.
5. The preview displays the captured image and a deterministic mock ingredient result.
6. Scan Again clears the image and result and returns to the camera.
7. Denied permission shows an explanatory message and a retry control.
8. Capture errors show an inline error and leave the user able to retry.

## Component Boundary

The active implementation remains `src/features/scan/CameraCapture.js`. It owns camera permission state, the camera ref, captured image state, scan-result state, and capture errors. OCR and classification will be added behind the result-processing boundary in a later milestone; this change must not introduce model or database dependencies.

## State Model

- `checking`: permission request is pending.
- `denied`: permission is unavailable or rejected.
- `ready`: permission is granted and no photo exists.
- `preview`: a photo URI and mock result exist.

The component derives the visible state from permission status, photo URI, and error state rather than maintaining duplicate state flags.

## Test Contract

The component exposes these test IDs: `camera-view`, `capture-btn`, `preview`, and `scan-again-btn`. Tests mock `expo-camera` and verify permission request, granted and denied states, capture transition, result rendering, reset behavior, and capture failure handling. Async interactions are awaited so tests model the device flow accurately.

## Acceptance Criteria

- Permission is requested on mount.
- Granted permission renders the rear camera.
- Denied permission renders recovery UI.
- Capture transitions from camera to preview.
- Preview renders the captured image and result text.
- Scan Again returns to the camera.
- Capture failures do not crash the screen.
- Focused scanner tests pass without requiring a physical camera.
