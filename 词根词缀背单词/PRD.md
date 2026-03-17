# PRD.md

## 1. Product Overview

### Product Name
MorphLex

### Product Definition
MorphLex is a local-first desktop vocabulary learning tool that helps users transform imported words into a visible morphology network built around prefixes, roots, and suffixes.

### One-Line Summary
一个把单词转成构词网络的本地学习工具。

### Product Version Target
v0.1 desktop application specification, close to release-ready quality.

### Platform
- Desktop app
- Windows first
- Cross-platform architecture should not be hard-coded

### Core Product Value
MorphLex helps users batch import English words, automatically organize them into import records, and analyze them into prefixes, roots, and suffixes so the user can browse, connect, and expand vocabulary through word formation rather than isolated memorization.

---

## 2. Target Users

### Primary Users
- Individual learners who want to memorize English vocabulary through morphology
- Users who prefer local, private, offline-first tools
- Users who want a structured, minimalist word study environment rather than gamified memorization

### Secondary Users
- Advanced learners preparing for academic English vocabulary
- Users who already have word lists and want to reorganize them by roots and affixes

### User Characteristics
- Comfortable with importing word lists manually
- Values structure, speed, and clarity over social features
- Does not need cloud-first collaboration in v0.1
- Accepts that AI accuracy is not perfect in the first version as long as the workflow is complete

---

## 3. Product Goals

### Primary Goals
1. Allow users to import words in batches through text, `.txt`, or `.csv`
2. Persist all core data locally using SQLite
3. Organize imported data into `session > batch > words`
4. Analyze imported words into prefixes, roots, and suffixes
5. Present a global morphology collection book for browsing and exploration
6. Allow users to view word detail with phonetic, meaning, and example sentences
7. Support root expansion with “generate more” behavior
8. Preserve a smooth, minimalist, VS Code-inspired desktop experience

### Secondary Goals
1. Prepare a clean AI Provider abstraction for future DeepSeek integration
2. Preserve enough architectural structure for future sync and account capabilities
3. Keep the first version local-first and demo-complete

---

## 4. Success Criteria

### Product Success Criteria
A version is considered “done” when all of the following are true:

1. The app runs locally as a Tauri desktop application on Windows
2. Users can import words via pasted text, `.txt`, and `.csv`
3. Import cleaning rules run consistently and visibly
4. If the cleaned word count exceeds 120, the user is prompted to confirm automatic split into multiple batches
5. Imported data is saved into SQLite and can be reopened after app restart
6. The app automatically navigates to the imported session detail page after a successful import
7. Import history is viewable in reverse chronological order
8. A session detail page shows batches in collapsible sections
9. Morphology collection pages exist for prefixes, roots, and suffixes
10. Root entries support “generate more,” adding 8 non-duplicated examples per trigger when possible
11. Word detail modal works from both session pages and morphology pages
12. Local analysis supports clear job states: `pending`, `processing`, `completed`, `failed`
13. Errors are visible, recoverable where required, and do not silently corrupt user data
14. UI theme, theme color, avatar upload, and font size settings persist locally
15. The app remains usable without network dependency

### UX Success Criteria
1. Navigation is clear with a narrow left sidebar and a single main content area
2. Hover and click feedback feel lightweight and fast
3. Visual style remains minimal, consistent, and advanced
4. User can understand “what was imported,” “what was analyzed,” and “what failed” without guessing

---

## 5. Non-Goals

The following are explicitly out of scope for v0.1:

- Real account registration and login
- Real phone verification by SMS
- Real cloud sync
- Multi-device sync
- Word export
- Word-level deletion
- Manual editing of analysis results
- Manual appending of words into an existing session
- Mobile adaptation
- Complex spaced repetition or review algorithm
- Check-in / streak systems
- Data sharing or collaboration
- Online-dependent AI analysis
- Full linguistic accuracy guarantees for morphology recognition
- Rich animation-heavy UI
- Multi-window desktop experience

---

## 6. Core Design Principles

1. **Local-first**
   - The first version must work without network dependency.

2. **Structure before intelligence**
   - UI flow, persistence, and data model must be correct before AI sophistication.

3. **Closed-loop usability**
   - Every major function must be demonstrable, clickable, and saveable.

4. **Minimalist but not barren**
   - The interface should feel calm, advanced, and efficient, inspired by VS Code.

5. **Fast feedback**
   - Import count, analysis state, empty state, and failure state must all be visible.

6. **No fake complexity**
   - Do not introduce heavy backend or account systems into v0.1.

---

## 7. Scope Summary

### In Scope
- Desktop app shell with Tauri
- Local SQLite persistence
- Guest mode
- Account panel UI placeholders
- Settings panel with theme and font size
- Batch import by text / `.txt` / `.csv`
- Cleaning and de-duplication rules
- Session and batch model
- Import history and session detail pages
- Prefix / root / suffix collection pages
- Root “generate more”
- Word detail modal
- Local avatar upload
- Local job state management
- AI Provider abstraction layer with mock implementation path

### Out of Scope
See section “Non-Goals”.

---

## 8. Information Architecture

### Global Layout
The application uses a two-column desktop layout:

#### Left Sidebar
- Narrow width, icon-only by default
- Top: account entry
- Bottom: settings entry
- Hover reveals labels
- Click opens slide-over panels

#### Main Content Area
- Single routed content area
- Centered layout
- Maximum width constrained for readability

### Routes
- `/`
- `/import`
- `/notebooks`
- `/notebooks/:sessionId`
- `/morphemes`
- `/morphemes/prefixes`
- `/morphemes/roots`
- `/morphemes/suffixes`

### Overlay UI
- Account slide-over
- Settings slide-over
- Word detail modal
- Split-confirm modal
- Delete-session confirm modal

---

## 9. User Stories

### Import and Session Management
1. As a user, I want to paste a list of words and quickly create a new import session.
2. As a user, I want to upload a `.txt` or `.csv` file and let the app extract words from it.
3. As a user, I want the app to clean input automatically so I do not need to manually normalize word lists.
4. As a user, I want to know how many valid words are recognized before importing.
5. As a user, I want the app to warn me when I exceed 120 words and offer automatic split into batches.
6. As a user, I want the imported session to be saved locally and still exist after restart.
7. As a user, I want to reopen a past import and inspect the words associated with it.

### Morphology Exploration
8. As a user, I want the app to analyze my imported words into prefixes, roots, and suffixes.
9. As a user, I want a global morphology collection page so I can browse structure across imports.
10. As a user, I want to see which imported words match a morpheme first, before seeing generated examples.
11. As a user, I want roots to include richer examples than prefixes or suffixes.
12. As a user, I want to click a word and see phonetic, meaning, and example sentences.
13. As a user, I want to generate more root examples and store them locally.

### Settings and Local Identity
14. As a user, I want to upload an avatar for a more personalized local workspace.
15. As a user, I want to adjust font size.
16. As a user, I want to switch between light and dark appearance.
17. As a user, I want to switch among orange, green, blue, and purple theme colors.
18. As a user, I want settings to persist locally.

### Reliability
19. As a user, I want to know when analysis fails and retry it manually.
20. As a user, I want delete confirmation to clearly state that the action cannot be undone.

---

## 10. Functional Requirements

## 10.1 Home Page

### Purpose
Provide a clean entry point into the three primary workflows.

### Requirements
- Show three vertically stacked, clickable cards:
  1. 批量导入单词
  2. 查看导入记录
  3. 浏览词根词缀
- Each card contains:
  - short title
  - subtitle
  - clickable card behavior
- Home page includes a “recent import” quick access area
- If no session exists yet, the recent import area should show an empty state instead of a broken link

### Acceptance Criteria
- Clicking a card navigates to the correct route
- Recent import shortcut opens the latest session detail
- Home page remains visually balanced in dark theme by default

---

## 10.2 Left Sidebar

### Purpose
Provide persistent access to account and settings.

### Requirements
- Width: narrow icon-only presentation
- Top icon: account
- Bottom icon: settings
- Hover reveals label
- Click opens slide-over panel
- Theme colors apply to sidebar surfaces
- Sidebar background uses lighter variant of current theme color
- Hover state uses subtle and fast darkening

### Acceptance Criteria
- Sidebar remains visible across all routes
- Icons are understandable without text
- Hover and click feedback are consistent
- Panels do not replace current route content

---

## 10.3 Account Panel

### Purpose
Provide local profile personalization and future-facing account placeholders.

### Requirements
- Default gray avatar icon
- Allow avatar upload
- Uploaded avatar replaces default icon
- Supported formats: `png`, `jpg`, `jpeg`, `webp`
- Maximum size: `2MB`
- Avatar file copied into application data directory
- Database stores local avatar path
- Show guest mode description
- Show phone binding placeholder
- Show cloud sync placeholder
- Show local data directory description

### Acceptance Criteria
- Valid image file updates avatar successfully
- Invalid format or oversized file shows error
- Avatar persists after app restart
- Phone binding and cloud sync cannot be mistaken for implemented features

---

## 10.4 Settings Panel

### Purpose
Provide minimal but persistent local customization.

### Requirements
- Font family is fixed to sans-serif / black-style preference
- Preferred stack should prioritize `Microsoft YaHei` on Windows
- Font size options:
  - 小
  - 中
  - 大
  - 超大
- Theme mode options:
  - Light
  - Dark
- Theme colors:
  - Orange
  - Green
  - Blue
  - Purple
- Include “restore defaults”
- Persist settings locally in SQLite

### Acceptance Criteria
- Changes apply immediately
- Settings persist after restart
- Restore defaults resets only supported settings
- Font family is not user-configurable

---

## 10.5 Import Page

### Purpose
Create new import sessions through text or file input.

### Requirements
- Use a single large import card
- Support:
  - text paste/import
  - `.txt` upload
  - `.csv` upload
- Show real-time import metrics:
  - recognized valid word count
  - cleaned count
  - warning when over 120
- `.csv` parsing rule:
  - read all recognizable words in the file regardless of column names
- Cleaning rules:
  - trim leading/trailing spaces
  - convert to lowercase
  - remove duplicates
  - filter empty items
  - keep original order
  - remove clearly invalid symbols
  - preserve legal internal hyphen
  - keep items containing letters
  - reject pure numbers
  - reject pure symbols

### Over-Limit Rule
- Maximum words per batch: 120
- If cleaned input exceeds 120:
  - show confirmation modal
  - ask whether to split automatically into multiple batches
  - do not remember user preference in v0.1

### Post-Import Behavior
- Save first
- Then trigger asynchronous local analysis job
- Then auto-navigate to `/notebooks/:sessionId`

### Acceptance Criteria
- Text import and file import both work
- Empty file produces a clear error
- No valid word produces a clear error
- Over-limit confirmation works
- Session is saved before analysis begins
- Navigation after success is automatic

---

## 10.6 Import Data Model Behavior

### Purpose
Define how imported words are grouped.

### Rules
- One user import action = one `import session`
- One session may contain multiple `batches`
- Each batch may contain at most 120 words
- Multiple batches from the same import remain linked to the same session

### Word Reuse Rule
- Global word records should be de-duplicated when possible
- Session and batch should preserve association records even if the same word already exists globally

### Acceptance Criteria
- A 250-word import can become 1 session with multiple batches
- Session detail clearly groups words by batch
- Global word data is not duplicated unnecessarily

---

## 10.7 Import History Page

### Purpose
Allow users to browse recent and historical imports.

### Requirements
- Show most recent sessions first
- Top view shows recent 5 sessions
- Each session block displays:
  - import time
  - valid word count
  - analysis status
  - first 5 example words
- Example word truncation rule:
  - if a single word is longer than 20 letters, truncate that word with ellipsis
- Bottom shows gray ellipsis-style continuation block
- Clicking continuation opens full history list
- Full list:
  - reverse chronological order
  - scrollable
  - no manual sort in v0.1
  - no complex filtering in v0.1

### Acceptance Criteria
- Recent 5 are visible on the first-level history view
- Full history is accessible
- Session click opens correct detail page
- Empty state is clear when no imports exist

---

## 10.8 Session Detail Page

### Purpose
Allow users to inspect a specific imported session.

### Requirements
- Route: `/notebooks/:sessionId`
- Show session summary:
  - import time
  - total valid words
  - analysis status
- Show search field scoped only to current session
- Show batches as collapsible sections
- Each batch lists its associated words
- Allow session deletion
- Allow re-analysis of current session
- Word items are clickable and open a unified word detail modal

### Re-Analysis Rule
- Re-analyzing a session overwrites old analysis results for that session

### Delete Rule
- Deleting removes the whole session and all linked batches and associations
- Confirmation modal must state the action is irreversible

### Acceptance Criteria
- Search only filters current session words
- Delete removes the full session
- Re-analysis updates state and replaces session-level analysis output
- Clicking a word opens the same modal component used elsewhere

---

## 10.9 Morphology Collection Home

### Purpose
Provide an entry directory for morphology browsing.

### Requirements
- Route: `/morphemes`
- Show three horizontal cards:
  - Prefixes
  - Roots
  - Suffixes
- This view is global, not per-session, in v0.1

### Acceptance Criteria
- All three cards are accessible
- Layout remains stable and centered
- Empty state is handled if no analysis data exists yet

---

## 10.10 Prefix / Root / Suffix List Pages

### Purpose
Show categorized morphology entries.

### Requirements
For each entry, show:
- morpheme text
- type label
- core meaning
- matched imported word count
- short variants
- 2–3 preview example words

### Scope Differences
- Prefix page: lightweight examples
- Suffix page: lightweight examples
- Root page: richer examples and expansion support

### Acceptance Criteria
- Entries are grouped under correct category route
- List remains readable with many entries
- Unavailable data is shown with graceful fallback rather than broken UI

---

## 10.11 Morphology Detail View

### Purpose
Show structured information for a selected morpheme.

### Required Structure
1. Header
2. Core meaning
3. Common variants
4. Brief etymology
5. Imported matched words
6. Expanded example words
7. “Generate more” section (root only in v0.1)

### Example Count Rules
- Prefix detail:
  - imported matched words first
  - at least 2 total expanded examples
- Suffix detail:
  - imported matched words first
  - at least 2 total expanded examples
- Root detail:
  - imported matched words first
  - at least 8 total expanded examples

### Generate More
- Supported only for roots in v0.1
- Hover on ellipsis area shows “generate more” intent
- Click triggers generation
- Each trigger appends 8 additional examples
- New examples should avoid duplicates whenever possible
- New generated content is persisted locally

### Acceptance Criteria
- Imported matched words always appear before expansion examples
- Generate more is unavailable on prefix/suffix pages
- Root expansion updates UI and local data
- Failure state is visible and retryable where appropriate

---

## 10.12 Word Detail Modal

### Purpose
Provide unified word information regardless of where the word is clicked.

### Trigger Sources
- Session detail page
- Morphology detail page

### Content Order
1. Word text
2. Phonetic
3. Chinese meaning
4. Daily-use example sentence
5. Academic-use example sentence
6. Related morphemes (prefix / root / suffix)

### Requirements
- Same modal component across all trigger sources
- Display-only in v0.1
- No favorite / copy / edit / action buttons in v0.1

### Acceptance Criteria
- Modal content structure is consistent
- Missing fields degrade gracefully
- Modal can be closed quickly and predictably

---

## 10.13 Analysis Engine Behavior

### Purpose
Convert imported words into morphology-linked data.

### Source Strategy
v0.1 uses:
- static dictionary
- rule matching
- mock extension JSON

### AI Dependency Rule
- Analysis must not require network connectivity in v0.1
- AI Provider abstraction must exist for future extension
- DeepSeek is a future provider implementation, not a hard dependency in v0.1

### Unrecognized Word Rule
- If a word cannot be mapped to any prefix, root, or suffix:
  - keep the word
  - mark it as unrecognized
  - do not force it into incorrect morpheme classification

### Multi-Match Rule
- A word may link to multiple morphemes
- All valid candidate links may coexist in v0.1
- No manual ranking or human arbitration is required in v0.1

### Acceptance Criteria
- Analysis result can create multi-link relations
- Unrecognized words remain visible in session data
- Analysis does not block import persistence

---

## 10.14 Analysis Job States

### Purpose
Make background processing visible and recoverable.

### Job States
- `pending`
- `processing`
- `completed`
- `failed`

### Applies To
- post-import analysis
- root expansion jobs

### UI Behavior
- show text status
- show simple loading indicator during processing
- show failure state inline
- allow manual retry where applicable

### Acceptance Criteria
- State transitions are stored and readable
- Failed states are visible, not silent
- Retry path exists for session re-analysis and root expansion failure

---

## 10.15 Error Handling

### Required MVP Error Cases
- empty import file
- no valid words after cleaning
- over-limit split confirmation
- SQLite write failure
- local analysis failure
- generate-more failure
- avatar upload failure
- unsupported avatar format
- oversized avatar file

### UX Rules
- success feedback: primarily toast
- error / empty / failed states: primarily inline page state
- destructive actions must use confirm modal

### Acceptance Criteria
- Each listed error state has a visible user-facing treatment
- App never silently discards input without explanation
- Recovery path is available where required

---

## 10.16 Desktop Behavior

### Requirements
- Single main window
- Standard minimize / maximize / close
- No multi-window workflow
- Reopen with previous window size
- Window position does not need to be remembered in v0.1

### Acceptance Criteria
- App behaves like a normal desktop utility
- Window behavior does not interfere with routing or overlays

---

## 10.17 Persistence Rules

### Requirements
Persist locally:
- settings
- user profile
- avatar path
- import sessions
- batches
- word links
- analysis results
- generated expansions
- job states

### File Storage
- SQLite database stored in application data directory
- Avatar files stored in local application data directory
- App uninstall does not automatically imply database deletion unless user manually removes local data

### Acceptance Criteria
- Restart preserves data
- Local paths remain valid until user removes files
- Schema initialization is automatic on first launch

---

## 10.18 Testability Requirements

### Minimum Required Test Scope
- unit tests:
  - import cleaning rules
  - batch splitting rules
  - state transitions
- component tests:
  - key modals
  - import form

### Not Required to Block MVP
- end-to-end test suite

### Acceptance Criteria
- Core pure logic is testable independent of UI
- Key modal and form behavior has component-level verification

---

## 11. Accessibility and Usability Notes

This version does not aim for full formal accessibility certification, but should still follow baseline usability discipline:
- sufficient contrast in light and dark modes
- keyboard escape closes modal where appropriate
- click targets remain usable
- text scaling through supported size presets remains readable

---

## 12. Open Constraints for Future Versions

The following are intentionally reserved for future evolution:
- DeepSeek provider implementation
- cloud synchronization
- account system
- manual correction of morphology results
- cross-device continuity
- export capability
- advanced study workflows

---

## 13. Definition of Done

MorphLex v0.1 is complete when:
- the desktop app runs locally,
- local persistence is reliable,
- import → session → morphology → word detail → root expansion forms a complete loop,
- all required states and errors are visible,
- the UI style remains coherent and minimal,
- and no core workflow depends on internet connectivity.
