# CLAUDE.md

## Project Rules for Building (HF-Dev2-challenge — React Native / Expo)

### General Principles
- Use the Workflow tool for multi-step or complex tasks (Ultracode is on).
- Author and verify before committing; use adversarial checks for critical work.

---

### 1. Coding Standards (ESLint)
- **Strict conventions + ESLint required:** Enforce consistent naming (camelCase components, PascalCase files), shared folder structure, and linting via ESLint.
- Use the standard React Native ESLint config (`eslint-plugin-react`, `eslint-plugin-react-native`).
- All source files must pass linting before build/commit.
- Use TypeScript where appropriate; maintain type safety across shared modules.

### 2. Testing Requirements
- **Tests must pass + CI required:** Tests must pass before commits.
- Unit: Jest with `@testing-library/react-native`.
- E2E: Detox for Android/iOS.
- CI runs both unit (`npm test`) and e2e (`npm run e2e`) on push/PR; every PR must include passing tests. Do not skip CI checks.

### 3. Dependency Management
- Use `npm ci` for exact version resolution in CI (never `npm install`).
- Any dependency change requires a PR description explaining why.
- Pin exact versions where stability is critical; use caret ranges for non-critical libraries.
- Review lockfile changes; require PR review for dependency updates; run `npm audit` and address findings.
- Never commit unreviewed `package-lock.json` changes.

### 4. Architecture and Design Patterns
- **Feature-based + separation implemented:** Use `src/features/<feature>` structure (e.g., `src/features/auth`) with sub-folders for screens, components, hooks, types, and api.
- State management: Context + hooks per feature.
- Clear separation of concerns: separate UI, logic, and data layers.
- Follow existing patterns; do not mix flat and feature-based structures without justification.

### 5. Lint-staged
- Run ESLint + Prettier on staged files before each commit.

### 6. CI Configuration
- **GitHub Actions** workflow on push/PR runs lint, unit tests, and build. Detox e2e runs nightly or on merge to main.

---

### 7. Build & Development
- Run `npm install` after checking out branches; verify `.expo` settings are aligned.
- Use `npm run lint`, `npm test`, and `npm run build` as standard checks.
- Commit messages should describe the change; include `Co-Authored-By: Claude Code <noreply@anthropic.com>` when using Claude assistance.
- End PR descriptions with: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
