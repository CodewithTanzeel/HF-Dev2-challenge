# Offline OCR and Halal Classification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Execute this plan task-by-task with focused validation after each task.

**Goal:** Add offline English OCR and explainable Halal/Haram/Uncertain classification after camera capture.

**Architecture:** Keep OCR behind an adapter so native ML Kit can be mocked in tests. Normalize and classify text in pure JavaScript. Seed curated rules into SQLite and persist scan evidence through small database helpers. The camera screen orchestrates capture, OCR, classification, persistence, and recoverable UI states.

**Tech Stack:** Expo development build, Expo Camera, Google ML Kit native OCR adapter, Expo SQLite, Jest, React Native Testing Library.

---

### Task 1: Define the pure classification core

**Files:** Create `src/features/scan/ingredientText.js`, `src/features/scan/classification.js`, and focused tests beside them.

- [ ] Test normalization of case, punctuation, parenthetical text, and whitespace.
- [ ] Test splitting ingredient lines into individual candidates while ignoring the `Ingredients:` label.
- [ ] Test exact names and synonyms against rule records.
- [ ] Test the decision matrix: Haram wins, then Uncertain, then Halal.
- [ ] Return matched records, unknown ingredients, overall status, and human-readable reasoning.
- [ ] Run pure unit tests before adding native modules.

### Task 2: Seed and query the offline SQLite ruleset

**Files:** Modify `db/init.js`; create `db/halalRules.js` and `db/rules.js`; add database tests.

- [ ] Extend `halal_rules` with a normalized status and synonyms while preserving existing rows.
- [ ] Seed a small curated English ruleset containing clearly Halal, clearly Haram, and context-dependent ingredients.
- [ ] Initialize schema and seed data idempotently with `INSERT OR IGNORE`.
- [ ] Add parameterized rule lookup helpers and tests for empty, matched, and unknown ingredients.
- [ ] Keep unknown ingredients Uncertain rather than defaulting them to Halal.

### Task 3: Add the native OCR adapter

**Files:** Create `src/features/scan/ocr/OcrService.js` and its tests; modify `package.json` and Expo configuration as required.

- [ ] Select an Expo-compatible ML Kit text-recognition package for the current SDK.
- [ ] Add the package and required config plugin to the dependency manifest.
- [ ] Implement `recognizeIngredients(imageUri)` returning raw English text or a typed empty/error result.
- [ ] Mock the adapter in tests for successful text, empty text, and native failure.
- [ ] Document that OCR requires a custom Expo development build, not standard Expo Go.

### Task 4: Connect capture to OCR, classification, and persistence

**Files:** Modify `src/features/scan/CameraCapture.js`; create `db/scans.js`; add integration tests.

- [ ] After capture, call the OCR adapter immediately.
- [ ] Normalize and classify recognized text using the SQLite rules.
- [ ] Persist the image-independent scan text, ingredient evidence, and classification with parameterized statements.
- [ ] Show processing, result, empty-OCR, OCR-error, and persistence-error states without losing the captured image.
- [ ] Display status, extracted text, matched ingredients, unknown ingredients, and reasoning.
- [ ] Keep Scan Again available from every result/error state.

### Task 5: Build and device validation

**Files:** Modify `app.json` and documentation as needed.

- [ ] Generate or run an Expo development build with the OCR native module.
- [ ] Test English labels in airplane mode with a real camera.
- [ ] Test blurry labels, empty OCR, unknown additives, a clearly Haram ingredient, and a clearly Halal ingredient.
- [ ] Run the full Jest suite and Expo project validation.
- [ ] Record the development-build install/start commands for future testing.
