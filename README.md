# Halal Scanner

> React Native / Expo app — verify ingredients with offline OCR, SQLite halal rules, and camera scan flow.

- **Project:** `halal-scanner` (v1.0.0)
- **SDK:** Expo ~58 (`expo`, `expo-camera`, `expo-sqlite`)
- **Branch:** `main` / milestone [#1 — HF-Dev2 Project Completion](https://github.com/CodewithTanzeel/HF-Dev2-challenge/milestone/1)

## Project Structure (feature-based)

```
src/features/auth/     # Login validation (#2), AuthContext refresh token (#1), AsyncStorage
src/features/scan/     # CameraCapture (#4), OCR service, classification rules, processScan
db/                   # SQLite rules (halalRules.js), scans persistence, init schema
e2e/                  # Detox smoke tests (#7)
docs/                 # E2E / SQA workflow (#9 finalized), offline OCR notes
```

## Scripts

- `npm start` / `npx expo start` — Metro bundler
- `npm run lint` — ESLint (passes)
- `npm test` — Jest (32 passed; auth + scan coverage #8)
- `npm run build` — skipped (metro conflict documented #11 / PR #11)
- `npm run e2e` / `e2e:android` / `e2e:ios` — Detox (#7)

## Completed Issues / PRs

| Issue | PR | Status | Summary |
|---|---|---|---|
| #1 | #10 | Merged | Auth refresh token |
| #2 | #13 | Merged | Login validation + inline errors |
| #3 | #14 | Merged | SQLite rules schema / persistence |
| #4 | #15 | Merged | OCR text stabilization; #19 supplement open (edge cases) |
| #5 | #11 | Merged | CI lint + build scripts |
| #6 | #16 | Merged | Expo dev build / phone connection |
| #7 | #17 | Merged | Detox E2E smoke tests |
| #8 | #18 | Merged | Unit tests (auth + scan) |
| #9 | #12 | Merged | SQA workflow docs finalized |

## Dependency Rules (CLAUDE.md #3)

- `npm ci` required in CI (never `npm install`)
- Lockfile (`package-lock.json`) reviewed per PR
- `package.json` uses exact versions / caret for stable, overrides for `metro` / `metro-resolver`

## Attributes

Commit messages include: `Co-Authored-By: Claude Code <noreply@anthropic.com>`  
Pull request descriptions end with: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

---

Created with Claude Code assistance.

Co-Authored-By: Claude Code <noreply@anthropic.com>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
