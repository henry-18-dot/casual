# IMPLEMENTATION_PLAN.md

## 1. Goal

This document defines the build order for MorphLex v0.1.

It is not a feature wishlist.
It is a construction sequence designed to reduce AI guessing, reduce rework, and keep the app demo-complete at every major milestone.

---

## 2. Execution Principles

1. Build local-first from day one
2. Lock project structure before feature code
3. Finish persistence contracts before rich UI state
4. Implement full workflow slices, not disconnected widgets
5. Prefer vertical slices that are testable and demoable
6. Mock AI before integrating any remote provider
7. Update `progress.txt` after each major milestone

---

## 3. Phase Overview

- Phase 1: Project bootstrap
- Phase 2: App shell and routing
- Phase 3: Local persistence foundation
- Phase 4: Settings and local profile
- Phase 5: Import workflow
- Phase 6: Import history and session detail
- Phase 7: Morphology collection
- Phase 8: Word detail and expansion behavior
- Phase 9: Error handling and polish
- Phase 10: Testing and release readiness

---

## 4. Phase 1 — Project Bootstrap

### Step 1.1
Initialize the Tauri + React + Vite + TypeScript project using the locked stack from `TECH_STACK.md`.

### Step 1.2
Configure pnpm workspace and install locked dependencies.

### Step 1.3
Create top-level project folders:

```txt
src/
src/app/
src/components/
src/features/
src/routes/
src/stores/
src/services/
src/providers/
src/lib/
src/styles/
src/types/
src-tauri/src/
src-tauri/src/commands/
src-tauri/src/db/
src-tauri/src/repositories/
src-tauri/src/services/
src-tauri/src/models/
src-tauri/src/analysis/
src-tauri/migrations/
resources/mock/
resources/dictionaries/
resources/seeds/
tests/
docs/
```

### Step 1.4
Set up base linting, formatting, and typecheck scripts.

### Step 1.5
Set up Tailwind CSS and global CSS token system.

### Step 1.6
Create placeholder `README` notes for resource folders so future AI or contributors know their purpose.

### Deliverable
Project boots and runs with the intended folder structure and toolchain.

---

## 5. Phase 2 — App Shell and Routing

### Step 2.1
Create the application shell:
- fixed left sidebar
- routed main content area
- content max width container

### Step 2.2
Implement route map:
- `/`
- `/import`
- `/notebooks`
- `/notebooks/:sessionId`
- `/morphemes`
- `/morphemes/prefixes`
- `/morphemes/roots`
- `/morphemes/suffixes`

### Step 2.3
Add placeholder page components for every route.

### Step 2.4
Build sidebar icons with hover labels.

### Step 2.5
Implement slide-over infrastructure for account and settings panels.

### Step 2.6
Implement shared modal infrastructure using Radix.

### Deliverable
User can navigate the full app shell with placeholder content and global overlays.

---

## 6. Phase 3 — Local Persistence Foundation

### Step 3.1
Set up Rust-side database initialization.

### Step 3.2
Create migration runner using `rusqlite_migration`.

### Step 3.3
Implement initial migrations for:
- `app_settings`
- `user_profile`
- `import_sessions`
- `import_batches`
- `words`
- `session_words`
- `morphemes`
- `word_morpheme_links`
- `word_details`
- `morpheme_expansions`
- `analysis_jobs`

### Step 3.4
Create Rust repository modules for each major aggregate.

### Step 3.5
Create typed Tauri command wrappers for:
- settings
- profile
- import preview
- session create
- session list
- session detail
- session delete
- session reanalyze
- morpheme list
- morpheme detail
- word detail
- expansion jobs

### Step 3.6
Create TypeScript DTOs matching command responses.

### Deliverable
App initializes database and can read/write typed data through Tauri commands.

---

## 7. Phase 4 — Settings and Local Profile

### Step 4.1
Implement `app_settings` bootstrap defaults.

### Step 4.2
Build settings slide-over UI:
- font size preset
- theme mode
- theme color
- restore defaults

### Step 4.3
Apply settings to global CSS variables and app shell immediately after load.

### Step 4.4
Persist settings updates to SQLite.

### Step 4.5
Implement `user_profile` bootstrap defaults.

### Step 4.6
Build account panel UI:
- avatar area
- guest description
- phone placeholder
- cloud sync placeholder
- local data directory note

### Step 4.7
Implement avatar upload validation and local file copy flow.

### Step 4.8
Persist avatar path and reload it on app startup.

### Deliverable
Theme, font size, and avatar all persist locally.

---

## 8. Phase 5 — Import Workflow

### Step 5.1
Build `/import` page main card layout.

### Step 5.2
Implement text paste input area.

### Step 5.3
Implement file upload support for `.txt` and `.csv`.

### Step 5.4
Implement frontend import preview using service layer wrappers.

### Step 5.5
Implement cleaning rules in a shared pure logic module.

### Step 5.6
Ensure backend preview and frontend preview remain consistent.

### Step 5.7
Display:
- valid word count
- cleaned count
- over-limit warning

### Step 5.8
Implement split confirmation modal when cleaned words exceed 120.

### Step 5.9
Implement session creation flow:
- create session
- create batches
- create global words
- create session-word links
- create pending analysis job

### Step 5.10
Auto-navigate to `/notebooks/:sessionId` after successful import.

### Step 5.11
Add success toast and import failure inline states.

### Deliverable
Import text and files work end-to-end into persistent session records.

---

## 9. Phase 6 — Import History and Session Detail

### Step 6.1
Build `/notebooks` recent overview page.

### Step 6.2
Render recent 5 sessions with:
- import time
- cleaned count
- analysis status
- first 5 preview words

### Step 6.3
Implement gray continuation block and full history list state.

### Step 6.4
Build `/notebooks/:sessionId` page.

### Step 6.5
Render session summary and actions row.

### Step 6.6
Render batches as collapsible sections.

### Step 6.7
Render clickable words under each batch.

### Step 6.8
Implement session-scoped search.

### Step 6.9
Implement delete session confirm modal and deletion flow.

### Step 6.10
Implement re-analysis trigger and status refresh behavior.

### Deliverable
User can browse import history, inspect sessions, search, delete, and reanalyze.

---

## 10. Phase 7 — Morphology Collection

### Step 7.1
Create local dictionary and rule resources in `resources/`.

### Step 7.2
Implement Rust analysis engine skeleton:
- dictionary lookup
- rule matching
- mock JSON extension

### Step 7.3
Implement session analysis job executor.

### Step 7.4
Write morpheme, link, detail, and expansion data into SQLite.

### Step 7.5
Build `/morphemes` home with three horizontal cards.

### Step 7.6
Build list pages for:
- prefixes
- roots
- suffixes

### Step 7.7
Render morpheme entry cards with:
- text
- type
- meaning
- hit count
- variants
- preview examples

### Step 7.8
Implement morpheme detail view structure:
1. header
2. core meaning
3. variants
4. etymology
5. imported matched words
6. expanded examples
7. generate more area

### Deliverable
Import analysis results are browsable globally through morphology pages.

---

## 11. Phase 8 — Word Detail and Root Expansion

### Step 8.1
Build shared word detail modal component.

### Step 8.2
Connect modal to session detail word clicks.

### Step 8.3
Connect modal to morpheme detail word clicks.

### Step 8.4
Ensure word modal renders:
- phonetic
- Chinese meaning
- daily example
- academic example
- related morphemes

### Step 8.5
Implement root-only “generate more” trigger.

### Step 8.6
Implement hover hint over ellipsis area.

### Step 8.7
Implement expansion job creation.

### Step 8.8
Generate 8 additional examples while avoiding duplicates where possible.

### Step 8.9
Persist generated examples locally.

### Step 8.10
Render failed expansion state and allow retry path.

### Deliverable
Word detail and root expansion complete the product learning loop.

---

## 12. Phase 9 — Error Handling and Product Polish

### Step 9.1
Implement all required empty states:
- no sessions
- no morphemes
- no search results
- no valid words
- empty file

### Step 9.2
Implement all required failure states:
- SQLite write failure
- analysis failure
- expansion failure
- avatar upload failure

### Step 9.3
Add loading indicators for:
- session load
- analysis processing
- expansion processing

### Step 9.4
Add toast system for success cases.

### Step 9.5
Tune hover, focus, and transition timings to match the frontend guidelines.

### Step 9.6
Verify theme tokens apply consistently across cards, panels, buttons, and inputs.

### Deliverable
App feels coherent, stable, and understandable.

---

## 13. Phase 10 — Testing and Release Readiness

### Step 10.1
Add unit tests for import cleaning rules.

### Step 10.2
Add unit tests for batch splitting rules.

### Step 10.3
Add unit tests for job state transitions.

### Step 10.4
Add component tests for:
- import form
- split modal
- delete modal
- word detail modal

### Step 10.5
Verify cold start behavior:
- DB init
- default settings creation
- profile bootstrap

### Step 10.6
Verify restart persistence:
- settings
- avatar
- sessions
- morphemes
- expansions

### Step 10.7
Prepare build configuration for Windows-first packaging.

### Deliverable
The project is ready for internal v0.1 build output.

---

## 14. Suggested Milestone Cuts

## Milestone A — Shell Ready
Complete Phases 1–2

## Milestone B — Persistence Ready
Complete Phase 3

## Milestone C — Import Closed Loop
Complete Phases 4–5

## Milestone D — Browse and Inspect
Complete Phase 6

## Milestone E — Morphology Closed Loop
Complete Phases 7–8

## Milestone F — v0.1 Hardening
Complete Phases 9–10

---

## 15. Definition of Implementation Completion

Implementation is complete when:
- all required routes exist
- import works end-to-end
- local persistence is durable
- morphology browsing works
- root expansion works
- word detail modal works
- required errors are visible
- settings and avatar persist
- the app can be built as a Windows-first Tauri desktop app

---

## 16. Progress Discipline

After each major milestone:
1. update `progress.txt`
2. note what was completed
3. note what remains
4. note any breakages or technical debt
5. note the next recommended step

This is mandatory, not optional.
