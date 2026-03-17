# BACKEND_STRUCTURE.md

## 1. Overview

MorphLex v0.1 is a local-first desktop application.
Its backend is not a remote web service. Instead, it is a **local application backend** implemented inside the Tauri Rust layer.

This file defines:
- persistence model
- schema
- table structure
- relationships
- command contracts
- storage rules
- analysis job rules
- edge cases
- future AI provider boundaries

---

## 2. Backend Model

Locked backend structure:

- Frontend React UI
- Frontend store/service layer
- Tauri command layer
- Rust service layer
- Rust repository layer
- SQLite database
- Local filesystem for avatars and resource files

There is **no remote HTTP backend in v0.1**.

---

## 3. Persistence Responsibilities

## 3.1 SQLite stores
- app settings
- user profile
- import sessions
- import batches
- global word records
- session-word relationships
- morphemes
- word-morpheme relationships
- word detail records
- root expansion records
- analysis jobs

## 3.2 Local filesystem stores
- avatar image files
- optional future local logs
- bundled dictionaries / mock JSON resources

---

## 4. Database Rules

1. SQLite is the single persistence source of truth.
2. Every schema change must go through migrations.
3. Foreign keys must be enabled.
4. Soft delete is **not** required in v0.1.
5. Timestamps are stored as ISO 8601 strings in UTC.
6. Boolean values are stored as integer `0/1`.
7. Enum-like states are stored as constrained text values.
8. UI must never infer missing relational data without explicit backend shaping.

---

## 5. Entity Model

Core entities:
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

The earlier planning phrase `import_words` is normalized in the actual schema into:
- `words` (global word table)
- `session_words` (session/batch linkage table)

This better supports global de-duplication while preserving session context.

---

## 6. Schema Definition

## 6.1 `app_settings`

Purpose:
Store persistent local app preferences.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | INTEGER | PK, always `1` | single-row table |
| `theme_mode` | TEXT | NOT NULL | `dark` or `light` |
| `theme_color` | TEXT | NOT NULL | `orange`, `green`, `blue`, `purple` |
| `font_size_preset` | TEXT | NOT NULL | `small`, `medium`, `large`, `xlarge` |
| `created_at` | TEXT | NOT NULL | ISO UTC |
| `updated_at` | TEXT | NOT NULL | ISO UTC |

Rules:
- only one row is allowed
- app bootstrap creates default row if missing

---

## 6.2 `user_profile`

Purpose:
Store local guest identity and avatar metadata.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | INTEGER | PK, always `1` | single-row table |
| `display_name` | TEXT | NULL | optional local label |
| `avatar_path` | TEXT | NULL | local filesystem path |
| `is_guest` | INTEGER | NOT NULL DEFAULT 1 | always `1` in v0.1 |
| `phone_binding_status` | TEXT | NOT NULL DEFAULT `placeholder` | placeholder only |
| `cloud_sync_status` | TEXT | NOT NULL DEFAULT `placeholder` | placeholder only |
| `created_at` | TEXT | NOT NULL | ISO UTC |
| `updated_at` | TEXT | NOT NULL | ISO UTC |

Rules:
- single-row table
- no real auth fields in v0.1
- no phone number persistence required in MVP

---

## 6.3 `import_sessions`

Purpose:
Represent one user import action.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | TEXT | PK | UUID or ULID |
| `source_type` | TEXT | NOT NULL | `text`, `txt_file`, `csv_file` |
| `source_label` | TEXT | NULL | filename or short source label |
| `raw_input_count` | INTEGER | NOT NULL | before cleaning |
| `cleaned_word_count` | INTEGER | NOT NULL | after cleaning |
| `batch_count` | INTEGER | NOT NULL | number of batches created |
| `analysis_status` | TEXT | NOT NULL | current summarized status |
| `has_unrecognized_words` | INTEGER | NOT NULL DEFAULT 0 | bool |
| `created_at` | TEXT | NOT NULL | import time |
| `updated_at` | TEXT | NOT NULL | last session mutation |

Rules:
- one import action creates one session
- a session may contain multiple batches
- delete session deletes all child batches and links

---

## 6.4 `import_batches`

Purpose:
Represent each maximum-120-word group under one session.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | TEXT | PK | UUID or ULID |
| `session_id` | TEXT | NOT NULL, FK | references `import_sessions(id)` |
| `batch_index` | INTEGER | NOT NULL | zero-based or one-based, choose one and keep consistent |
| `word_count` | INTEGER | NOT NULL | count in this batch |
| `created_at` | TEXT | NOT NULL | ISO UTC |

Constraints:
- unique `(session_id, batch_index)`

Rules:
- max `120` words per batch
- session detail UI groups by batch

---

## 6.5 `words`

Purpose:
Global normalized word table.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | TEXT | PK | UUID or ULID |
| `lemma` | TEXT | NOT NULL UNIQUE | cleaned lowercase canonical word |
| `display_text` | TEXT | NOT NULL | same as lemma in v0.1 |
| `normalized_hash` | TEXT | NOT NULL UNIQUE | optional hash for fast dedupe |
| `first_seen_at` | TEXT | NOT NULL | ISO UTC |
| `updated_at` | TEXT | NOT NULL | ISO UTC |

Rules:
- same cleaned word reused globally
- never duplicate same normalized word intentionally

---

## 6.6 `session_words`

Purpose:
Bridge global words into session and batch context.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | TEXT | PK | UUID or ULID |
| `session_id` | TEXT | NOT NULL, FK | references `import_sessions(id)` |
| `batch_id` | TEXT | NOT NULL, FK | references `import_batches(id)` |
| `word_id` | TEXT | NOT NULL, FK | references `words(id)` |
| `original_order_index` | INTEGER | NOT NULL | preserves cleaned import order |
| `is_unrecognized` | INTEGER | NOT NULL DEFAULT 0 | bool |
| `created_at` | TEXT | NOT NULL | ISO UTC |

Constraints:
- unique `(session_id, batch_id, original_order_index)`
- unique `(session_id, batch_id, word_id, original_order_index)`

Rules:
- preserves import ordering
- even globally duplicated words remain linked independently per session
- first version does not support manual editing or appending to this table from UI

---

## 6.7 `morphemes`

Purpose:
Store recognized prefixes, roots, and suffixes.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | TEXT | PK | UUID or deterministic key |
| `morpheme_text` | TEXT | NOT NULL | e.g. `re-`, `spect`, `-tion` |
| `morpheme_type` | TEXT | NOT NULL | `prefix`, `root`, `suffix` |
| `core_meaning` | TEXT | NULL | short meaning |
| `variants_json` | TEXT | NULL | JSON array |
| `etymology_note` | TEXT | NULL | short text |
| `source_mode` | TEXT | NOT NULL | `dictionary`, `rule`, `mock_ai`, `hybrid` |
| `created_at` | TEXT | NOT NULL | ISO UTC |
| `updated_at` | TEXT | NOT NULL | ISO UTC |

Constraints:
- unique `(morpheme_text, morpheme_type)`

Rules:
- the same text may exist in different categories only if justified by data model
- root expansion only applies to rows where `morpheme_type = 'root'`

---

## 6.8 `word_morpheme_links`

Purpose:
Store many-to-many relationships between words and morphemes.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | TEXT | PK | UUID or ULID |
| `word_id` | TEXT | NOT NULL, FK | references `words(id)` |
| `morpheme_id` | TEXT | NOT NULL, FK | references `morphemes(id)` |
| `link_source` | TEXT | NOT NULL | `dictionary`, `rule`, `mock_ai`, `manual_seed` |
| `confidence_score` | REAL | NULL | optional heuristic score |
| `created_at` | TEXT | NOT NULL | ISO UTC |

Constraints:
- unique `(word_id, morpheme_id, link_source)`

Rules:
- a word may have multiple morpheme links
- no forced single-best link in v0.1
- no user editing of links in v0.1

---

## 6.9 `word_details`

Purpose:
Store display-ready lexical detail for words.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `word_id` | TEXT | PK, FK | references `words(id)` |
| `phonetic` | TEXT | NULL | IPA or simplified transcription |
| `chinese_meaning` | TEXT | NULL | short Chinese gloss |
| `daily_example` | TEXT | NULL | daily-use sentence |
| `academic_example` | TEXT | NULL | academic-use sentence |
| `detail_source` | TEXT | NOT NULL | `dictionary`, `mock_ai`, `hybrid` |
| `updated_at` | TEXT | NOT NULL | ISO UTC |

Rules:
- one row per word
- missing fields are allowed in MVP
- frontend must degrade gracefully

---

## 6.10 `morpheme_expansions`

Purpose:
Store examples shown under a morpheme, including generated examples.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | TEXT | PK | UUID or ULID |
| `morpheme_id` | TEXT | NOT NULL, FK | references `morphemes(id)` |
| `word_id` | TEXT | NOT NULL, FK | references `words(id)` |
| `source_type` | TEXT | NOT NULL | `imported_match`, `seed_example`, `generated_more` |
| `expansion_order` | INTEGER | NOT NULL | display order within this source group |
| `created_by_job_id` | TEXT | NULL, FK | references `analysis_jobs(id)` |
| `created_at` | TEXT | NOT NULL | ISO UTC |

Constraints:
- unique `(morpheme_id, word_id, source_type)`

Rules:
- imported matches appear first in UI
- generated root examples append after existing examples
- “generate more” should avoid duplicates whenever possible

---

## 6.11 `analysis_jobs`

Purpose:
Track asynchronous analysis and expansion jobs.

Columns:

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | TEXT | PK | UUID or ULID |
| `job_type` | TEXT | NOT NULL | `session_analysis`, `morpheme_expand` |
| `target_session_id` | TEXT | NULL, FK | references `import_sessions(id)` |
| `target_morpheme_id` | TEXT | NULL, FK | references `morphemes(id)` |
| `status` | TEXT | NOT NULL | `pending`, `processing`, `completed`, `failed` |
| `requested_count` | INTEGER | NULL | e.g. expansion size `8` |
| `result_count` | INTEGER | NULL | actual generated count |
| `error_message` | TEXT | NULL | short diagnostic |
| `created_at` | TEXT | NOT NULL | ISO UTC |
| `started_at` | TEXT | NULL | ISO UTC |
| `completed_at` | TEXT | NULL | ISO UTC |
| `updated_at` | TEXT | NOT NULL | ISO UTC |

Check rules:
- session analysis jobs must have `target_session_id`
- morpheme expand jobs must have `target_morpheme_id`

---

## 7. Relationships

## 7.1 Relationship Summary

- `import_sessions` 1 -> N `import_batches`
- `import_sessions` 1 -> N `session_words`
- `import_batches` 1 -> N `session_words`
- `words` 1 -> N `session_words`
- `words` N <-> N `morphemes` through `word_morpheme_links`
- `words` 1 -> 1 `word_details`
- `morphemes` 1 -> N `morpheme_expansions`
- `analysis_jobs` optionally relate to `import_sessions`
- `analysis_jobs` optionally relate to `morphemes`

---

## 8. Auth Logic

There is no real auth in v0.1.

Rules:
- application always runs in guest mode
- `user_profile.is_guest = 1`
- phone bind and cloud sync are placeholders only
- no token storage
- no session cookie logic
- no remote auth endpoint contracts

Future auth is out of scope for current schema, except that `user_profile` leaves room for expansion.

---

## 9. Storage Rules

## 9.1 Database File
Recommended path concept:
- `<app_data_dir>/data/app.db`

## 9.2 Avatar Files
Recommended path concept:
- `<app_data_dir>/data/avatars/<generated_filename>`

Rules:
- copy uploaded avatar into local application directory
- do not store base64 in DB
- store resolved local path in `user_profile.avatar_path`

## 9.3 Resource Files
Bundled dictionaries / mock JSON:
- application resources directory
- read-only during normal runtime

---

## 10. Import Cleaning Contract

The backend must enforce the same normalized rules used by the UI preview.

Cleaning rules:
- trim leading/trailing whitespace
- lowercase all words
- filter empty values
- remove duplicates while preserving first appearance order
- keep entries containing letters
- allow internal hyphen
- reject pure numbers
- reject pure symbols
- remove clearly invalid outer symbols

Important:
- UI count and backend final count must match
- backend remains final authority if mismatch occurs

---

## 11. Batch Split Contract

Rule:
- each batch may contain at most 120 words

If cleaned words exceed 120:
- frontend must ask for confirmation
- backend accepts already confirmed split plan
- backend creates one session and multiple batches

Split strategy:
- preserve original cleaned order
- batch sizes should be sequential contiguous slices
- example: `250` words => `120 + 120 + 10`

---

## 12. Analysis Engine Structure

## 12.1 v0.1 Analysis Sources
- static dictionary
- rule matching
- mock extension JSON

## 12.2 Session Analysis Behavior
When a session is analyzed:
1. create or update analysis job
2. evaluate words in that session
3. create / reuse morphemes
4. create / refresh session-relevant `word_morpheme_links`
5. populate `morpheme_expansions` with imported matches
6. populate missing `word_details` where possible
7. mark unrecognized session words
8. finalize job state

## 12.3 Re-analysis Rule
Re-analyzing a session:
- overwrites session-level analysis outputs
- may reuse global words and global morphemes
- refreshes links and expansion records relevant to that session

---

## 13. Expansion Rule for Roots

Only `root` morphemes support “generate more” in v0.1.

Behavior:
1. create `morpheme_expand` job
2. request 8 more examples
3. avoid already linked expansion words when possible
4. create or reuse global `words`
5. populate `word_details` for new words when possible
6. create `morpheme_expansions` with `source_type = 'generated_more'`
7. update job status

Repeated clicks:
- append another 8 when possible
- do not replace existing generated rows
- avoid duplicates whenever possible

---

## 14. Tauri Command Contracts

These are local IPC contracts, not HTTP endpoints.

## 14.1 Settings Commands

### `get_app_settings() -> AppSettingsDTO`
Returns current persisted settings.

### `update_app_settings(payload) -> AppSettingsDTO`
Input:
- `themeMode`
- `themeColor`
- `fontSizePreset`

### `reset_app_settings() -> AppSettingsDTO`
Resets supported settings to defaults.

---

## 14.2 User Profile Commands

### `get_user_profile() -> UserProfileDTO`

### `upload_avatar(payload) -> UserProfileDTO`
Input:
- temporary file path or bytes reference
- original file name
- mime type
- size

Validation:
- formats `png`, `jpg`, `jpeg`, `webp`
- max `2MB`

### `remove_avatar() -> UserProfileDTO`
Optional in implementation; not required by MVP UI, but safe to keep in backend contract.

---

## 14.3 Import Commands

### `preview_import_text(payload) -> ImportPreviewDTO`
Input:
- raw text

Returns:
- raw input count
- cleaned word count
- cleaned words preview
- over-limit flag

### `preview_import_file(payload) -> ImportPreviewDTO`
Input:
- file path
- file type

Returns same shape as text preview.

### `create_import_session(payload) -> SessionCreateResultDTO`
Input:
- source type
- source label
- cleaned words
- confirmed split boolean

Returns:
- session id
- batch ids
- cleaned count
- batch count
- initial job state

---

## 14.4 Session Commands

### `list_recent_sessions() -> SessionSummaryDTO[]`
Returns recent sessions ordered newest first.

### `list_all_sessions() -> SessionSummaryDTO[]`
Returns full history ordered newest first.

### `get_session_detail(sessionId) -> SessionDetailDTO`

### `delete_session(sessionId) -> DeleteResultDTO`

### `reanalyze_session(sessionId) -> JobDTO`

### `search_session_words(payload) -> SessionWordDTO[]`
Input:
- `sessionId`
- `query`

---

## 14.5 Morpheme Commands

### `list_morphemes_by_type(type) -> MorphemeListItemDTO[]`
Types:
- `prefix`
- `root`
- `suffix`

### `get_morpheme_detail(morphemeId) -> MorphemeDetailDTO`

### `expand_morpheme(payload) -> JobDTO`
Input:
- `morphemeId`
- `count` default `8`

Rule:
- reject non-root in v0.1

---

## 14.6 Word Detail Commands

### `get_word_detail(wordId) -> WordDetailDTO`

---

## 14.7 Job Commands

### `get_job(jobId) -> JobDTO`

### `list_session_jobs(sessionId) -> JobDTO[]`

---

## 15. DTO Notes

DTOs should be shaped for UI use, not raw row dumping.

Rules:
- do not expose raw SQL names blindly if frontend naming conventions differ
- use stable contract names
- preserve typed enums where possible
- batch nested data should be returned already grouped for session detail UI

---

## 16. Edge Cases

## 16.1 Empty Import File
- return validation error
- do not create session

## 16.2 No Valid Words After Cleaning
- return validation error
- do not create session

## 16.3 Over 120 Without Confirmation
- backend rejects create request unless split is confirmed or words already fit

## 16.4 SQLite Failure
- return structured failure
- do not partially claim success to UI

## 16.5 Analysis Failure
- session remains saved
- job marked `failed`
- `analysis_status` on session reflects failure

## 16.6 Expansion Failure
- existing morpheme detail remains intact
- failed job is stored
- no partial duplicate expansion should be inserted if transaction fails

## 16.7 Avatar Upload Failure
- old avatar remains unchanged
- no broken DB path should be written

## 16.8 Missing Avatar File on Reopen
- fallback to default avatar
- do not crash
- optional cleanup may clear stale path later

## 16.9 Unrecognized Words
- preserved in `session_words`
- flagged with `is_unrecognized = 1`
- absent from morpheme lists unless linked later

## 16.10 Multi-Match Words
- multiple `word_morpheme_links` allowed
- modal may show multiple related morphemes

---

## 17. Transaction Rules

Use DB transactions for:
- session creation with batches and session_words
- session deletion
- session re-analysis writeback
- root expansion insertion
- avatar metadata update

Rule:
Either the whole action succeeds, or no partial write is committed.

---

## 18. Future Compatibility Rules

Schema should stay compatible with future additions:
- real account identity
- cloud sync metadata
- per-word learning metadata
- manual review flags
- AI provider provenance
- remote sync cursor state

Do not add these fields now unless needed by v0.1 workflows.

---

## 19. Final Backend Rule

If frontend assumptions conflict with the schema or command contracts in this file, update the frontend plan before implementation proceeds.
