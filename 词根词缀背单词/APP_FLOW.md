# APP_FLOW.md

## 1. Overview

This document defines the screen map, route structure, user navigation flows, decision points, success outcomes, and failure outcomes for MorphLex v0.1.

MorphLex is a single-window desktop application with route-based navigation in the main content area. Global overlays are used for account, settings, word detail, and critical confirmations.

---

## 2. Route List

### Main Routes
- `/`
- `/import`
- `/notebooks`
- `/notebooks/:sessionId`
- `/morphemes`
- `/morphemes/prefixes`
- `/morphemes/roots`
- `/morphemes/suffixes`

### Global Overlay Routes / States
These are not full routes, but global UI layers:
- Account panel
- Settings panel
- Word detail modal
- Split confirmation modal
- Delete session confirmation modal

---

## 3. Screen Inventory

### Screen 1: Home
**Route:** `/`

**Purpose:**
Provide access to the three primary product workflows and the latest session shortcut.

**Main Elements:**
- Import card
- Import history card
- Morpheme collection card
- Recent import shortcut

**Possible States:**
- Default state
- Empty recent import state
- Hover state on cards

---

### Screen 2: Import Page
**Route:** `/import`

**Purpose:**
Allow the user to create a new import session from pasted text or uploaded file.

**Main Elements:**
- Text input area
- File upload area
- Real-time valid word count
- Cleaned count
- Over-limit warning
- Import action
- Split confirmation modal (when needed)

**Possible States:**
- Empty state
- Valid input state
- Over-limit warning state
- Importing state
- Save success state
- Import error state

---

### Screen 3: Notebooks Overview
**Route:** `/notebooks`

**Purpose:**
Allow the user to browse recent and historical import sessions.

**Main Elements:**
- Recent 5 session blocks
- Session metadata
- Example words preview
- Continuation block for full history
- Scrollable full history list

**Possible States:**
- No sessions state
- Recent list state
- Full history list state

---

### Screen 4: Session Detail
**Route:** `/notebooks/:sessionId`

**Purpose:**
Allow the user to inspect one import session.

**Main Elements:**
- Session summary
- Search field
- Analysis status
- Re-analyze action
- Delete session action
- Batch collapsible sections
- Word list
- Word detail modal trigger

**Possible States:**
- Loading state
- Search results state
- Analysis pending state
- Analysis processing state
- Analysis completed state
- Analysis failed state
- Empty batch state
- Delete confirmation state

---

### Screen 5: Morpheme Collection Home
**Route:** `/morphemes`

**Purpose:**
Provide entry points into prefixes, roots, and suffixes.

**Main Elements:**
- Prefixes card
- Roots card
- Suffixes card

**Possible States:**
- Default state
- No analyzed data state

---

### Screen 6: Prefix List
**Route:** `/morphemes/prefixes`

**Purpose:**
Display global prefix entries.

**Main Elements:**
- Prefix entries list
- Entry preview information
- Clickable entry items

**Possible States:**
- Empty state
- Populated list state

---

### Screen 7: Root List
**Route:** `/morphemes/roots`

**Purpose:**
Display global root entries.

**Main Elements:**
- Root entries list
- Entry preview information
- Clickable entry items

**Possible States:**
- Empty state
- Populated list state

---

### Screen 8: Suffix List
**Route:** `/morphemes/suffixes`

**Purpose:**
Display global suffix entries.

**Main Elements:**
- Suffix entries list
- Entry preview information
- Clickable entry items

**Possible States:**
- Empty state
- Populated list state

---

### Screen 9: Morpheme Detail View
**Route Behavior:**
This may be implemented as an in-page detail panel, nested route, or dedicated section in the category page.  
The exact implementation is flexible, but the flow requirements are fixed.

**Purpose:**
Display structured details for one morpheme.

**Main Elements:**
- Morpheme header
- Core meaning
- Variants
- Brief etymology
- Imported matched words
- Expanded example words
- Generate more trigger (root only)
- Word detail modal trigger

**Possible States:**
- Data available state
- No imported matches state
- Expansion available state
- Expansion processing state
- Expansion failed state

---

### Global Overlay A: Account Panel
**Trigger:**
Sidebar top icon click

**Purpose:**
Show avatar, guest identity, phone placeholder, cloud sync placeholder, and local data directory note.

---

### Global Overlay B: Settings Panel
**Trigger:**
Sidebar bottom icon click

**Purpose:**
Allow font size, theme mode, theme color, and restore defaults.

---

### Global Overlay C: Word Detail Modal
**Trigger:**
Click word from session detail or morpheme detail

**Purpose:**
Show phonetic, meaning, examples, and related morphemes.

---

### Global Overlay D: Split Confirmation Modal
**Trigger:**
Import valid word count exceeds 120

**Purpose:**
Ask whether the user allows automatic split into batches.

---

### Global Overlay E: Delete Session Confirmation Modal
**Trigger:**
Delete action on session detail page

**Purpose:**
Confirm irreversible session deletion.

---

## 4. Global Navigation Rules

1. The application uses one main desktop window.
2. The left sidebar is always visible.
3. Main route changes only affect the right content area.
4. Account and settings do not navigate away; they open as slide-over panels.
5. Critical actions requiring user confirmation must use modal confirmation.
6. Word detail should always use the same modal component regardless of trigger source.

---

## 5. Primary Flow: App Launch

### Trigger
User opens MorphLex.

### Sequence
1. App launches.
2. Local database initialization runs if needed.
3. App settings are loaded.
4. The last saved appearance settings are applied.
5. The home route `/` is shown.

### Success Outcome
- User sees the home page with the correct theme and settings.

### Failure Outcome
- If local initialization fails, the app should show a recoverable error state or fail-safe screen instead of crashing silently.

---

## 6. Primary Flow: Open Account Panel

### Trigger
User clicks the top sidebar icon.

### Sequence
1. User hovers over account icon.
2. Label appears on hover.
3. User clicks the icon.
4. Account slide-over panel opens.
5. User may upload avatar or inspect placeholders.

### Success Outcome
- Panel opens without route change.

### Failure Outcome
- If avatar file validation fails, show inline error or toast.
- If avatar file copy fails, show upload failure state.

---

## 7. Primary Flow: Open Settings Panel

### Trigger
User clicks the bottom sidebar icon.

### Sequence
1. User hovers over settings icon.
2. Label appears on hover.
3. User clicks the icon.
4. Settings slide-over panel opens.
5. User updates font size, theme mode, or theme color.
6. Changes apply immediately.
7. Changes persist locally.

### Success Outcome
- UI updates instantly and remains updated after app restart.

### Failure Outcome
- If settings persistence fails, show clear save failure feedback.

---

## 8. Primary Flow: Import Words by Text

### Trigger
User enters the import page and pastes words into the text area.

### Sequence
1. User navigates to `/import`.
2. User pastes text input.
3. The app parses input.
4. Cleaning rules are applied.
5. Real-time valid word count is displayed.
6. Cleaned count is displayed.
7. If valid count is greater than 120, show over-limit warning.
8. User clicks import.

### Decision Point A: Is the cleaned valid word count zero?
- Yes:
  - Show “no valid words” error state.
  - Stop the flow.
- No:
  - Continue.

### Decision Point B: Is the cleaned valid word count greater than 120?
- Yes:
  - Open split confirmation modal.
  - Ask whether to auto-split into multiple batches.
- No:
  - Continue with single-batch session creation.

### Decision Point C: Did the user confirm split?
- Yes:
  - Create one session with multiple batches.
- No:
  - Cancel import and remain on page.

### Sequence After Confirmation or Normal Case
9. Save session, batches, and word associations into SQLite.
10. Create local analysis job with `pending`.
11. Start asynchronous analysis.
12. Navigate automatically to `/notebooks/:sessionId`.

### Success Outcome
- The session is created and visible immediately.
- Analysis state is visible as pending or processing.

### Failure Outcome
- If SQLite write fails, show import failure state and do not navigate.
- If analysis fails later, session still exists but shows failed analysis status.

---

## 9. Primary Flow: Import Words by File

### Trigger
User uploads a `.txt` or `.csv` file on the import page.

### Sequence
1. User navigates to `/import`.
2. User selects a supported file.
3. The app reads the file content.
4. For `.csv`, the app extracts recognizable words across the file regardless of column names.
5. Cleaning rules are applied.
6. Real-time counts and warning rules behave the same as text import.
7. User confirms import.

### Decision Point A: Is the file empty?
- Yes:
  - Show empty file error.
  - Stop the flow.
- No:
  - Continue.

### Decision Point B: Are there valid cleaned words?
- No:
  - Show “no valid words” error.
  - Stop the flow.
- Yes:
  - Continue.

### Decision Point C: Is the valid count over 120?
- Yes:
  - Open split confirmation modal.
- No:
  - Continue.

### Success Outcome
- Same as text import flow.

### Failure Outcome
- Unsupported file handling should block early.
- Read failure should produce a visible import error state.

---

## 10. Primary Flow: View Import History

### Trigger
User navigates to `/notebooks` or clicks the notebook card on the home page.

### Sequence
1. User opens the notebooks overview page.
2. The app loads sessions in reverse chronological order.
3. The UI shows the latest 5 sessions first.
4. Each session block shows:
   - import time
   - valid word count
   - analysis status
   - first 5 preview words
5. User may click a session block to open detail.
6. User may click the continuation block to access full history.

### Success Outcome
- User can quickly inspect recent sessions and reach historical records.

### Failure Outcome
- If there are no sessions, show a clear empty state.
- If history load fails, show an inline error state.

---

## 11. Primary Flow: Open Session Detail

### Trigger
User clicks a session from home shortcut or notebooks overview.

### Sequence
1. User enters `/notebooks/:sessionId`.
2. App loads session metadata and related batches.
3. App shows session summary.
4. App shows batch sections as collapsible panels.
5. App shows words inside each batch.
6. User may search within the current session only.
7. User may click a word to open word detail.
8. User may re-analyze the session.
9. User may delete the session.

### Success Outcome
- User can inspect the complete imported session clearly.

### Failure Outcome
- If session does not exist, show not-found state.
- If session data cannot load, show inline load failure state.

---

## 12. Flow: Search Within a Session

### Trigger
User types into the search box on the session detail page.

### Sequence
1. User enters search text.
2. The app filters words only inside the current session.
3. Batch sections update to reflect matching results.

### Success Outcome
- Matching words are visible quickly and clearly.

### Failure Outcome
- If no words match, show a no-results state.

---

## 13. Flow: Re-Analyze Session

### Trigger
User clicks “re-analyze” on a session detail page.

### Sequence
1. User clicks the re-analyze action.
2. App creates or updates the analysis job.
3. Existing session-specific analysis output is replaced by the new run.
4. Status changes to `pending`, then `processing`.
5. When complete, status becomes `completed`.

### Success Outcome
- Updated analysis replaces the older result for that session.

### Failure Outcome
- If re-analysis fails, show failed status inline.
- User remains able to retry later.

---

## 14. Flow: Delete Session

### Trigger
User clicks delete on a session detail page.

### Sequence
1. User clicks delete.
2. Delete confirmation modal opens.
3. Modal states that deletion is irreversible.
4. User confirms or cancels.

### Decision Point: Did the user confirm?
- No:
  - Close modal and do nothing.
- Yes:
  - Delete the full session and all associated batches and links.

### Success Outcome
- Session is removed from history and cannot be reopened.

### Failure Outcome
- If deletion fails, show visible error feedback and preserve current state.

---

## 15. Primary Flow: Open Morpheme Collection Home

### Trigger
User clicks the morpheme card from the home page or navigates to `/morphemes`.

### Sequence
1. App opens the morpheme collection home.
2. User sees three category cards:
   - Prefixes
   - Roots
   - Suffixes
3. User selects one category.

### Success Outcome
- User enters the selected global morpheme category page.

### Failure Outcome
- If no analyzed data exists yet, show a meaningful empty state instead of a blank page.

---

## 16. Flow: Browse Morpheme Category

### Trigger
User opens `/morphemes/prefixes`, `/morphemes/roots`, or `/morphemes/suffixes`.

### Sequence
1. App loads all morphemes in the selected category.
2. App shows list entries with:
   - morpheme text
   - type label
   - core meaning
   - matched word count
   - variants
   - preview examples
3. User clicks an entry.

### Success Outcome
- User reaches the selected morpheme detail view.

### Failure Outcome
- If the category has no data, show empty state.

---

## 17. Flow: Open Morpheme Detail

### Trigger
User clicks a morpheme entry from a category list.

### Sequence
1. App opens the selected morpheme detail view.
2. App displays:
   - header
   - core meaning
   - common variants
   - brief etymology
   - imported matched words
   - expanded example words
3. Imported matched words appear before generated examples.
4. User may click any word for detail.

### Success Outcome
- The morpheme is understandable as a mini knowledge node.

### Failure Outcome
- Missing fields should fall back gracefully rather than breaking layout.

---

## 18. Flow: Generate More Root Examples

### Trigger
User opens a root detail view and interacts with the ellipsis area.

### Sequence
1. User hovers over the ellipsis area.
2. UI reveals that more examples can be generated.
3. User clicks the area.
4. App creates an expansion job.
5. Job status becomes `pending`, then `processing`.
6. App appends 8 additional example words if possible.
7. App avoids duplicates where possible.
8. Newly generated examples are persisted locally.

### Decision Point: Is the selected morpheme a root?
- Yes:
  - Continue.
- No:
  - Generate more is unavailable in v0.1.

### Success Outcome
- The detail page shows 8 more stored examples.

### Failure Outcome
- If expansion fails, show failed inline state.
- Existing content should remain intact.

---

## 19. Flow: Open Word Detail Modal

### Trigger
User clicks a word in session detail or morpheme detail.

### Sequence
1. App opens the unified word detail modal.
2. Modal shows:
   - word text
   - phonetic
   - Chinese meaning
   - daily-use sentence
   - academic-use sentence
   - related morphemes
3. User closes the modal.

### Success Outcome
- Same modal structure appears regardless of source page.

### Failure Outcome
- Missing detail data should degrade gracefully.
- If detail fetch fails, show modal error state instead of crashing the page.

---

## 20. Cross-Flow Rules for Unrecognized Words

### Trigger
A word cannot be mapped to any prefix, root, or suffix.

### Behavior
1. The word remains in the imported session.
2. The word is marked as unrecognized.
3. The word is not forced into an incorrect morpheme category.
4. The user can still open word detail if available.

### Success Outcome
- Data integrity is preserved even when morphology recognition is incomplete.

---

## 21. Cross-Flow Rules for Multi-Match Words

### Trigger
A word maps to multiple morpheme candidates.

### Behavior
1. All valid candidate links may be stored.
2. No manual ranking is required in v0.1.
3. Related morphemes shown in the word modal may include multiple entries across prefix, root, and suffix.

### Success Outcome
- The product supports structurally rich word formation relationships.

---

## 22. Global Error Flow Rules

### Import Errors
- Empty file
- No valid words
- SQLite write failure
- Unsupported avatar format
- Oversized avatar
- Analysis failure
- Expansion failure

### Error Handling Pattern
- Success feedback: toast-first
- Error and failed states: inline-first
- Destructive confirmation: modal-first

### Success Outcome
- Users understand what happened and what to do next.

### Failure Outcome
- No silent failure is allowed in core flows.

---

## 23. Startup and Persistence Flow

### Trigger
User closes and reopens the app.

### Sequence
1. App starts again.
2. Local database is loaded.
3. Local settings are applied.
4. Avatar path is resolved if available.
5. Routes open normally.

### Expected Persistence
- Settings remain saved
- Sessions remain saved
- Morpheme data remains saved
- Generated root expansions remain saved
- Avatar remains visible if file still exists

### Failure Outcome
- Missing local file references should not crash the app.
- Broken avatar path should fall back to default avatar.

---

## 24. Route-to-Screen Map Summary

| Route | Screen |
|---|---|
| `/` | Home |
| `/import` | Import Page |
| `/notebooks` | Notebooks Overview |
| `/notebooks/:sessionId` | Session Detail |
| `/morphemes` | Morpheme Collection Home |
| `/morphemes/prefixes` | Prefix List |
| `/morphemes/roots` | Root List |
| `/morphemes/suffixes` | Suffix List |

---

## 25. Definition of Flow Completion

The application flow is considered complete for v0.1 when:
1. A user can launch the app locally
2. Import words
3. Confirm split when needed
4. Reach session detail automatically
5. See analysis states
6. Browse import history
7. Open global morpheme categories
8. Open morpheme detail
9. Generate more examples for roots
10. Open word detail modal
11. Update local settings
12. Personalize local avatar
13. Recover from visible errors without losing the entire workflow
