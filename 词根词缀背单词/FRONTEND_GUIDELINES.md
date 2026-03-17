# FRONTEND_GUIDELINES.md

## 1. Design Intent

MorphLex should feel:
- minimal
- calm
- structured
- intelligent
- slightly technical
- close in spirit to VS Code, but not a clone

The interface must avoid:
- playful app-store visual language
- oversized marketing-style hero sections
- heavy gradients
- glassmorphism
- thick borders
- over-animated transitions
- crowded information density

The design target is **tool-quality UI**, not consumer-social UI.

---

## 2. Visual Principles

1. **Single-purpose surfaces**
   - Each block should communicate one action or one dataset.

2. **Low-noise hierarchy**
   - Use spacing and weight before using color.

3. **Quiet interactivity**
   - Hover and active states should be subtle and fast.

4. **Theme-driven consistency**
   - Theme color must affect all interactive surfaces through tokens, not ad hoc classes.

5. **Card clarity**
   - Cards should be flat enough to feel serious, but elevated enough to feel usable.

6. **Readable density**
   - Dense enough for a productivity tool, never cramped.

---

## 3. Layout System

## 3.1 App Shell

Desktop layout:
- fixed narrow left sidebar
- one routed main content area
- centered content container in the main area

Locked shell sizes:
- sidebar width: `64px`
- slide-over panel width: `320px`
- main content max width: `960px`

## 3.2 Main Container
Recommended wrapper:
- width: `100%`
- max-width: `960px`
- horizontal padding: `32px`
- top padding: `40px`
- bottom padding: `40px`

## 3.3 Page Vertical Rhythm
Use these spacing rules:
- page title to subtitle: `8px`
- title block to first content block: `24px`
- block to block: `20px`
- section title to section body: `12px`
- item to item inside same block: `10px`

---

## 4. Responsive Strategy

Even though v0.1 is desktop-first, internal responsiveness should still be defined.

Breakpoints:
- `sm`: `640px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1280px`

Rules:
- desktop layout is primary
- no mobile-first redesign is required
- content can compress modestly for smaller desktop windows
- sidebar remains fixed
- card stacks may collapse from horizontal to vertical below `md`

---

## 5. Typography

## 5.1 Font Stack
Font family is not user-configurable.

Preferred stack:
```css
font-family:
  "Microsoft YaHei",
  "Noto Sans SC",
  "Segoe UI",
  "PingFang SC",
  system-ui,
  sans-serif;
```

## 5.2 Font Size Presets
These map to the user setting.

- 小: base text `13px`
- 中: base text `14px`
- 大: base text `15px`
- 超大: base text `16px`

## 5.3 Type Scale
Use this scale:

- Page title: `28px / 700`
- Section title: `18px / 600`
- Card title: `16px / 600`
- Body text: `14px / 400`
- Secondary text: `13px / 400`
- Micro label: `12px / 500`

## 5.4 Text Rules
- Avoid center-aligned long paragraphs
- Use left-aligned descriptive text even in centered layouts
- Chinese UI copy should stay short and precise
- Secondary copy must not exceed two lines in cards where possible

---

## 6. Color System

## 6.1 Theme Modes
Supported modes:
- Dark
- Light

Default mode:
- Dark

## 6.2 Base Dark Theme Palette
Use a VS Code-adjacent dark gray-blue system.

### Neutral Tokens
- `--bg-app`: `#151A22`
- `--bg-sidebar`: `#1B2230`
- `--bg-surface`: `#1E2633`
- `--bg-surface-hover`: `#253043`
- `--bg-surface-active`: `#2B3750`
- `--bg-panel`: `#202938`
- `--bg-overlay`: `rgba(8, 12, 18, 0.62)`

- `--border-subtle`: `#2D384B`
- `--border-strong`: `#3A4760`

- `--text-primary`: `#E8EDF5`
- `--text-secondary`: `#AAB6C9`
- `--text-muted`: `#7D8AA0`
- `--text-disabled`: `#5E6A7D`

- `--state-success`: `#62B780`
- `--state-warning`: `#D3A25F`
- `--state-danger`: `#D96B6B`
- `--state-info`: `#6FA6E8`

## 6.3 Base Light Theme Palette
Light mode should preserve the same serious tone.

- `--bg-app`: `#F3F6FB`
- `--bg-sidebar`: `#E8EEF7`
- `--bg-surface`: `#FFFFFF`
- `--bg-surface-hover`: `#F4F7FC`
- `--bg-surface-active`: `#EAF0F9`
- `--bg-panel`: `#FFFFFF`
- `--bg-overlay`: `rgba(12, 18, 28, 0.18)`

- `--border-subtle`: `#D9E2EF`
- `--border-strong`: `#C4D0E2`

- `--text-primary`: `#1E2633`
- `--text-secondary`: `#49566B`
- `--text-muted`: `#6B7688`
- `--text-disabled`: `#98A3B3`

- `--state-success`: `#2E8B57`
- `--state-warning`: `#B97A2B`
- `--state-danger`: `#C24E4E`
- `--state-info`: `#3B78C6`

---

## 7. Theme Colors

Theme colors must be tokenized into at least:
- `theme.surfaceSoft`
- `theme.surfaceStrong`
- `theme.textAccent`
- `theme.ring`
- `theme.hoverWash`

### Orange Theme
- `theme.base`: `#D17C3F`
- `theme.surfaceSoft`: `rgba(209, 124, 63, 0.14)`
- `theme.surfaceStrong`: `rgba(209, 124, 63, 0.22)`
- `theme.textAccent`: `#E79A59`
- `theme.ring`: `rgba(209, 124, 63, 0.32)`
- `theme.hoverWash`: `rgba(209, 124, 63, 0.12)`

### Green Theme
- `theme.base`: `#3FA56B`
- `theme.surfaceSoft`: `rgba(63, 165, 107, 0.14)`
- `theme.surfaceStrong`: `rgba(63, 165, 107, 0.22)`
- `theme.textAccent`: `#5BC786`
- `theme.ring`: `rgba(63, 165, 107, 0.32)`
- `theme.hoverWash`: `rgba(63, 165, 107, 0.12)`

### Blue Theme
- `theme.base`: `#4C88D9`
- `theme.surfaceSoft`: `rgba(76, 136, 217, 0.14)`
- `theme.surfaceStrong`: `rgba(76, 136, 217, 0.22)`
- `theme.textAccent`: `#73A6EB`
- `theme.ring`: `rgba(76, 136, 217, 0.32)`
- `theme.hoverWash`: `rgba(76, 136, 217, 0.12)`

### Purple Theme
- `theme.base`: `#8A63D2`
- `theme.surfaceSoft`: `rgba(138, 99, 210, 0.14)`
- `theme.surfaceStrong`: `rgba(138, 99, 210, 0.22)`
- `theme.textAccent`: `#A98AE7`
- `theme.ring`: `rgba(138, 99, 210, 0.32)`
- `theme.hoverWash`: `rgba(138, 99, 210, 0.12)`

---

## 8. Surface Rules

## 8.1 Border Style
- solid color borders only
- no gradient borders
- no glowing borders by default

Default border:
- `1px solid var(--border-subtle)`

Strong focus border:
- `1px solid var(--border-strong)`

## 8.2 Radius
Use medium radius only.

Token set:
- `radius-sm`: `8px`
- `radius-md`: `12px`
- `radius-lg`: `14px`

Default use:
- inputs: `12px`
- cards: `14px`
- slide-over panel: `14px`
- modal: `14px`

## 8.3 Shadow
Shadow must remain light.

Default card shadow:
```css
0 8px 24px rgba(0, 0, 0, 0.12)
```

Modal shadow:
```css
0 16px 40px rgba(0, 0, 0, 0.22)
```

No dramatic blur-heavy shadow stacks.

---

## 9. Motion Rules

## 9.1 Transition Philosophy
Interactions should feel immediate.

Default transition:
- duration: `120ms`
- easing: `ease-out`

Allowed range:
- `90ms` to `160ms`

## 9.2 Hover Behavior
Buttons, cards, list items, and sidebar icons may:
- darken slightly
- raise by 1px at most if needed
- adjust border color subtly

Do not:
- scale aggressively
- bounce
- overshoot
- animate layout for decorative effect

## 9.3 Loading Indicators
Use:
- subtle spinner
- low-noise skeleton
- inline status line

Do not use large full-screen loading unless the app truly cannot render.

---

## 10. Component Rules

## 10.1 Sidebar
Style:
- fixed-width vertical strip
- lighter theme-tinted background
- icon-only default
- label on hover through tooltip or hover assist
- active icon uses stronger theme surface
- icons must remain monochrome or near-monochrome except selected state

Spacing:
- top and bottom action groups separated
- icon hit area at least `40x40`

## 10.2 Slide-over Panels
Used for:
- account
- settings

Style:
- width `320px`
- full-height right-side panel
- same surface family as cards
- subtle border-left
- shadow slightly stronger than cards
- content padding `20px`

## 10.3 Cards
Used for:
- home page entry blocks
- recent import blocks
- morpheme entry blocks
- import card

Card rules:
- medium radius
- subtle shadow
- theme hover wash allowed
- avoid thick border treatment
- card title near top-left
- metadata grouped under title
- clickable whole card where specified

## 10.4 Text Buttons
Buttons should feel close to VS Code:
- no heavy pill shape
- no thick border
- text-first
- compact height
- hover adds subtle background tint
- destructive variant uses muted red text or red hover wash
- primary actions may use stronger theme text and wash, not giant filled blocks

## 10.5 Inputs
Input style:
- flat surface
- subtle border
- no inset bevel
- placeholder muted
- focus ring from theme token
- comfortable padding

Default sizes:
- height `40px`
- textarea min-height `180px`

## 10.6 Search Field
Search field should:
- look integrated with the desktop tool style
- use stronger background than page
- show subtle focus ring
- not look like a consumer web search bar

## 10.7 Modals
Used for:
- word detail
- split confirmation
- delete confirmation

Rules:
- centered
- max width `560px` for general modal
- delete modal may be narrower
- overlay must dim but not fully black out the app
- modal body uses left-aligned content
- close affordance must be obvious

## 10.8 Batch Collapsible Sections
Used in session detail page.

Rules:
- clear batch header
- count badge optional
- open/close affordance lightweight
- word list inside should wrap naturally
- section borders remain subtle

## 10.9 Ellipsis Continuation Blocks
Used for:
- notebook overview continuation
- root expansion trigger

These two must not look identical in meaning.
Design distinction:
- history continuation block: gray, inert-looking until clicked
- root generation ellipsis: slightly interactive, hover reveals intent

---

## 11. Page-by-Page UI Rules

## 11.1 Home Page
Layout:
- vertically stacked cards
- each card centered within content column
- enough vertical spacing to feel deliberate
- recent import shortcut appears below primary cards

Card structure:
- title
- short subtitle
- subtle route affordance

## 11.2 Import Page
Layout:
- one large integrated card
- text import and file import in the same surface
- count and warnings close to the input, not detached
- import action visually clear but still text-button-like

## 11.3 Notebooks Overview
Layout:
- recent 5 sessions stacked vertically
- continuation block at bottom
- full list scroll area clearly separated when opened

Session card contents:
- import time
- valid word count
- analysis state
- up to 5 preview words

## 11.4 Session Detail
Layout:
- page header
- session metadata row
- search field
- actions row
- collapsible batch sections

Word chips / rows must remain readable and clickable, but not over-styled.

## 11.5 Morpheme Collection Home
Layout:
- three horizontal entry cards
- equal width columns
- centered in main content width
- collapse to vertical only when window becomes too narrow

## 11.6 Morpheme List Pages
Layout:
- title
- optional category description
- list of entry cards

Each entry card:
- morpheme text
- type
- meaning
- hit count
- variants
- preview examples

## 11.7 Morpheme Detail
Layout order:
1. header
2. meaning
3. variants
4. etymology
5. imported matched words
6. expanded examples
7. generate more area

Use vertical sections, not side-by-side columns, in v0.1.

---

## 12. Status and Feedback Styling

## 12.1 Analysis Status
Approved states:
- pending
- processing
- completed
- failed

Visual treatment:
- pending: muted neutral
- processing: info tone with spinner
- completed: success tone
- failed: danger tone with retry affordance nearby

## 12.2 Toast
Toast usage:
- save success
- import success
- settings saved
- avatar updated
- delete success

Toast rules:
- compact
- bottom-right or top-right
- auto-dismiss
- not used for critical persistent failure

## 12.3 Inline States
Use inline states for:
- no data
- no search result
- analysis failure
- import failure
- file parse failure
- empty collection

Inline states must include:
- short title
- one-sentence description
- recovery action when relevant

---

## 13. Accessibility Baseline

Even though v0.1 is not accessibility-certified, the following are required:
- visible keyboard focus
- sufficient text/background contrast
- `Esc` closes modal when appropriate
- hover-only hint must not hide core action meaning forever
- icon-only controls must have accessible labels

---

## 14. Tailwind Usage Rules

- Use semantic wrapper classes or helper functions where repetition becomes heavy
- Prefer tokenized CSS variables for theme colors
- Avoid hard-coded random hex codes inside components
- Avoid inline style unless truly required
- Avoid `!important`
- Do not create one-off arbitrary values unless the value is already a documented token

---

## 15. Naming Rules for Design Tokens

Suggested token groups:
- `color.bg.*`
- `color.text.*`
- `color.border.*`
- `color.state.*`
- `theme.*`
- `radius.*`
- `shadow.*`
- `space.*`
- `font.*`

All design decisions should map back to these tokens.

---

## 16. Final Frontend Rule

If a UI choice looks more expressive but less calm, reject it.
If a UI choice is slightly plainer but more consistent, choose it.
