# TECH_STACK.md

## 1. Project Positioning

MorphLex is a local-first desktop application for Windows-first delivery, built with a web frontend and a Rust-backed Tauri shell.

The stack is selected for:
- local desktop packaging
- stable local persistence
- strict route-based UI structure
- low-overhead state management
- future AI Provider replacement
- future cross-platform portability without rewriting the product core

---

## 2. Locked Versions

## 2.1 Runtime and Tooling

- Node.js: `22.22.1 LTS`
- pnpm: `10.32.1`
- Rust toolchain: `1.85.1`
- Cargo edition: `2024`

## 2.2 Frontend Core

- React: `19.2.4`
- React DOM: `19.2.4`
- TypeScript: `5.9.3`
- Vite: `8.0.0`
- `@vitejs/plugin-react`: `6.0.1`
- `react-router-dom`: `7.13.1`

## 2.3 UI and State

- Tailwind CSS: `4.2.1`
- `@tailwindcss/vite`: `4.2.1`
- Zustand: `5.0.12`
- `react-hook-form`: `7.71.2`
- Zod: `4.3.6`
- `@radix-ui/react-dialog`: `1.1.15`
- `@radix-ui/react-alert-dialog`: `1.1.15`
- `@radix-ui/react-tooltip`: `1.2.8`
- `@radix-ui/react-select`: `2.2.6`
- `lucide-react`: `0.577.0`

## 2.4 Testing

- Vitest: `4.1.0`
- `@testing-library/react`: `16.3.2`
- `@testing-library/jest-dom`: `6.9.1`
- `@vitest/coverage-v8`: `4.1.0`

## 2.5 Desktop / Rust Core

- `@tauri-apps/cli`: `2.10.1`
- `@tauri-apps/api`: `2.10.1`
- Rust crate `tauri`: `2.10.3`
- Rust crate `tauri-build`: `2.5.5`
- Rust crate `tokio`: `1.50.0`
- Rust crate `serde`: `1.0.228`
- Rust crate `serde_json`: `1.0.142`
- Rust crate `anyhow`: `1.0.102`
- Rust crate `rusqlite`: `0.38.0`
- Rust crate `rusqlite_migration`: `2.4.1`

---

## 3. Package Manager Policy

- Package manager is **pnpm only**
- `pnpm-lock.yaml` is source of truth
- No mixed package managers
- Do not commit `package-lock.json`, `yarn.lock`, or `bun.lockb`

---

## 4. Frontend Stack Decisions

## 4.1 React
React is used to build the routed desktop UI. The product is a single-window desktop interface with a narrow persistent sidebar and one routed main content area.

## 4.2 Vite
Vite is used for:
- local dev server
- fast HMR during UI work
- desktop-friendly bundling for Tauri frontend assets

## 4.3 TypeScript
TypeScript is mandatory for:
- all React components
- all stores
- all services
- all Tauri command contracts
- all domain model definitions

No plain JavaScript files are allowed in application source except generated config or tooling glue when unavoidable.

## 4.4 React Router
`react-router-dom` is used for route-based main area navigation.

Locked route structure:
- `/`
- `/import`
- `/notebooks`
- `/notebooks/:sessionId`
- `/morphemes`
- `/morphemes/prefixes`
- `/morphemes/roots`
- `/morphemes/suffixes`

---

## 5. Styling Stack Decisions

## 5.1 Tailwind CSS
Tailwind CSS is used for:
- spacing
- sizing
- layout
- typography tokens
- state styles
- color application
- card, panel, modal, and list styling

## 5.2 Global CSS
A small global stylesheet is allowed for:
- font stack
- scrollbar styling
- selection styling
- transition defaults
- VS Code-inspired polish details
- CSS variables for theme tokens

Global CSS must stay small and token-driven.

## 5.3 Radix UI
Radix UI is the only approved headless interaction layer for:
- dialogs
- alert dialogs
- tooltips
- select controls

No heavy visual component library is allowed in v0.1.

---

## 6. State Management

Zustand is used for client state.

Recommended store split:
- `useAppSettingsStore`
- `useUiStore`
- `useImportStore`
- `useSessionStore`
- `useMorphemeStore`
- `useJobStore`

Zustand is used for:
- route-adjacent state
- UI flags
- current filters
- currently open modal data
- optimistic UI state
- local cache of loaded entities

Do not use Zustand as a direct replacement for persistence.
SQLite remains the persistence source of truth.

---

## 7. Form and Validation

## 7.1 react-hook-form
Used for:
- import form
- settings controls
- avatar upload form behavior where relevant

## 7.2 Zod
Used for:
- frontend form validation
- service input validation
- Tauri command payload schema validation at UI boundary
- mock AI response shape validation

---

## 8. Desktop Shell and Rust Side

## 8.1 Tauri
Tauri is used as the desktop shell because the product target is a desktop utility, not a web app packaged later.

The desktop behavior must remain:
- single window
- route-based content area
- no multi-window workflow
- standard minimize / maximize / close
- restore last window size on reopen

## 8.2 Tauri Command Model
All business-critical write actions must go through Tauri commands instead of direct browser-only persistence.

Examples:
- create import session
- save settings
- upload avatar
- run migrations
- analyze session
- generate more root examples
- delete session

## 8.3 Why Tauri Command Layer Exists
This enforces:
- local file safety
- typed contract boundaries
- easier migration to cross-platform builds
- clear split between UI and local system access

---

## 9. Persistence Stack

## 9.1 SQLite
SQLite is the only approved primary persistence layer in v0.1.

Reasons:
- local-first product
- structured data relationships
- durable desktop persistence
- easy future migration path
- good fit for session > batch > word > morpheme models

## 9.2 Rust-side SQLite Access
SQLite access is implemented on the Rust side using `rusqlite`, not browser storage.

Rules:
- frontend never writes raw SQL
- SQL lives in Rust-side repository / migration layer
- schema creation and upgrades are migration-based
- no ad hoc schema drift

## 9.3 Migrations
Use `rusqlite_migration`.

Migration policy:
- every schema change gets a new numbered migration
- no manual database edits
- migration scripts must be idempotent within the migration system
- app startup must trigger migration check automatically

---

## 10. AI Provider Layer

DeepSeek is **not** a hard dependency in v0.1.

The AI layer must be abstracted behind a provider interface.

Approved interface surface:
- `healthCheck()`
- `analyzeWords(words[])`
- `expandMorpheme(morphemeId, count)`
- `generateWordDetail(word)`

v0.1 implementation path:
- static dictionary
- rule matching
- mock extension JSON
- local provider adapter

Future path:
- DeepSeek provider implementation
- provider switching through config
- hybrid local + remote enrichment

---

## 11. File and Storage Layout

Recommended top-level structure:

```txt
MorphLex/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ features/
│  ├─ routes/
│  ├─ stores/
│  ├─ services/
│  ├─ providers/
│  ├─ lib/
│  ├─ styles/
│  └─ types/
├─ src-tauri/
│  ├─ src/
│  │  ├─ commands/
│  │  ├─ db/
│  │  ├─ repositories/
│  │  ├─ services/
│  │  ├─ models/
│  │  ├─ analysis/
│  │  └─ main.rs
│  └─ migrations/
├─ public/
├─ resources/
│  ├─ mock/
│  ├─ dictionaries/
│  └─ seeds/
├─ tests/
└─ docs/
```

---

## 12. Data Access Layering

Locked architecture:

1. **UI Layer**
2. **Store Layer**
3. **Service Layer**
4. **Tauri Command Layer**
5. **SQLite**

Rules:
- components do not call SQL
- components do not transform raw DB rows
- stores do not contain SQL
- service layer is responsible for orchestration and domain shaping
- Tauri commands are the IPC boundary
- repositories own SQL

---

## 13. Testing Stack Policy

## 13.1 Unit Tests
Vitest for:
- import cleaning
- batch splitting
- state transitions
- parsing rules
- pure helper functions

## 13.2 Component Tests
React Testing Library for:
- import form
- split modal
- delete confirm modal
- word detail modal
- session search behavior

## 13.3 Not Required for MVP Block
- full E2E suite
- snapshot-heavy testing
- visual regression pipeline

---

## 14. Logging and Diagnostics

v0.1 logging policy:
- frontend: browser / dev console and structured service error propagation
- Rust side: structured logs prepared for future file sink
- local file logging is optional in MVP but architecture must not block it

Do not introduce external observability platforms in v0.1.

---

## 15. Security and Platform Policy

- Desktop app is local-first, not cloud-first
- No real auth secret flow in v0.1
- No raw external AI key hardcoding in source
- No unrestricted shell execution
- No write access outside approved app data directories
- Avatar file handling must validate type and size before persistence

---

## 16. Approved Dependencies Only

Do not add new libraries unless one of the following is true:
1. existing approved stack cannot solve the problem cleanly
2. dependency is added to this document first
3. dependency has a specific narrow responsibility
4. dependency meaningfully lowers implementation risk

---

## 17. Explicitly Rejected for v0.1

- Next.js
- Electron
- Redux Toolkit
- IndexedDB as primary store
- localStorage as primary store
- Prisma
- Supabase
- Firebase
- full UI component libraries
- online-only AI SDK dependence
- CSS-in-JS styling systems

---

## 18. Build Commands

Use these commands as defaults:

```bash
pnpm install
pnpm tauri dev
pnpm tauri build
pnpm test
```

Recommended scripts:
- `dev`
- `build`
- `tauri:dev`
- `tauri:build`
- `test`
- `test:watch`
- `lint`
- `typecheck`

---

## 19. Environment Variables

v0.1 should keep environment variable usage minimal.

Allowed examples:
- `VITE_APP_NAME`
- `VITE_AI_PROVIDER`
- `DEEPSEEK_API_KEY` (future only, not required in MVP)

Rules:
- frontend reads only `VITE_` variables
- sensitive provider keys must not be committed
- local-only mock mode must work with zero environment variables

---

## 20. Final Technical Rule

If implementation and document diverge, this file wins until intentionally updated.
