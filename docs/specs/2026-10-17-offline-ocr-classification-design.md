# Offline OCR and Halal Classification Design

**Date:** 2026-10-17
**Scope:** Offline English ingredient scanning and classification

## Goal

After a photo is captured, extract English ingredient text offline, classify the item as Halal, Haram, or Uncertain using a local SQLite ruleset, and save the result for scan history.

## Runtime Constraint

OCR will use Google ML Kit Text Recognition through an Expo-compatible native module. Testing requires a custom Expo development build; standard Expo Go cannot load arbitrary native OCR modules.

## Automatic Flow

1. Capture a photo.
2. Run on-device OCR immediately.
3. Normalize the extracted text and split ingredient candidates.
4. Match normalized candidates and known synonyms against SQLite `halal_rules`.
5. Compute the overall status.
6. Display the image, extracted text, status, matched ingredients, unknown ingredients, and reasoning.
7. Persist the scan, OCR text, ingredient matches, and classification.

## Classification Rules

- **Haram:** at least one ingredient is definitively haram.
- **Uncertain:** no ingredient is definitively haram, but at least one ingredient is unknown or context-dependent.
- **Halal:** every recognized ingredient is confidently halal.

The app will never silently treat an unknown ingredient as Halal. Results will explain which ingredients caused the status.

## SQLite Contract

The existing `halal_rules` table remains the source of truth for the first curated ruleset. Rules include a normalized name, status, optional certification/context note, and synonyms. Scan persistence uses the existing `scans`, `translations`, and `classifications` tables, extended only if required to store ingredient evidence without breaking existing rows.

## Failure States

- Blurry or unreadable image: explain that the label could not be read and allow another scan.
- Empty OCR result: show a retry action without saving a misleading classification.
- OCR/native module failure: show a recoverable error and preserve the captured image.
- Unknown ingredients: classify as Uncertain and list them explicitly.
- Database failure: show the result if available and explain that history could not be saved.

## Testing

Unit tests cover text normalization, ingredient splitting, synonym matching, and the Halal/Haram/Uncertain decision matrix. Integration tests mock ML Kit and SQLite to cover automatic capture-to-result flow, OCR failure, empty OCR, unknown ingredients, and persistence failure. Device validation covers the custom Expo build, real camera capture, airplane-mode OCR, and permission recovery.

## Out Of Scope

Non-English OCR, cloud OCR, barcode lookup, nutritional analysis, religious-authority certification claims, and model-based LLM classification are deferred.
