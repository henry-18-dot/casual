# MorphLex Codex-first Knowledge Base

This directory is the Codex-first version of the MorphLex project knowledge base.

## Entry point for Codex
- `AGENTS.md`

## Core product and implementation docs
- `PRD.md`
- `APP_FLOW.md`
- `TECH_STACK.md`
- `FRONTEND_GUIDELINES.md`
- `BACKEND_STRUCTURE.md`
- `IMPLEMENTATION_PLAN.md`
- `progress.txt`

## Usage
Place these files in the project root.
Codex should read `AGENTS.md` first, then follow the document order defined inside it.

## Note
This bundle is intentionally `AGENTS.md`-first.
`CLAUDE.md` is not included in this version.

## Frontend run + screenshot + mobile feedback tool

1. Start app with LAN support: `npm run dev:tool`
2. Start tool server: `npm run tool:serve`
3. Open `/tools` page in app and click **运行并截图**.
4. Open `http://<your-ip>:8787/mobile-feedback?project=morphlex` on your phone and submit feedback.

### Reuse from other projects

Call HTTP API directly:

- `POST /api/screenshot` body: `{ "route": "/", "project": "your-project" }`
- `POST /api/feedback` body: `{ "project":"your-project", "author":"name", "message":"...", "rating":5 }`
- `GET /api/feedback?project=your-project`

Or use CLI helper:

```bash
TOOL_API=http://127.0.0.1:8787 node scripts/tool-capture.mjs / your-project
```
