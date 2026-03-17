# AGENTS.md

## Overview

This file defines **instructions for AI coding agents** (OpenAI Codex, Cursor, Claude Code, etc.) working in this repository.

Treat this document as the **authoritative guide** for:

* project structure
* coding conventions
* build commands
* testing procedures
* safe modification rules

Agents must read this file **before editing any code**.

---

# Agent Operating Rules

## 1. Make Minimal Changes

When modifying code:

* prefer **small targeted patches**
* avoid large refactors
* preserve existing architecture
* avoid unnecessary formatting changes

Do not rewrite files unless explicitly requested.

---

## 2. Understand Before Editing

Before changing code:

1. read the entire file
2. inspect related modules
3. understand data flow
4. check existing patterns

Never guess project architecture.

---

## 3. Preserve Existing Behavior

Agents must **not break working functionality**.

Before committing changes:

* ensure previous logic still works
* ensure no API contracts are broken
* avoid renaming public interfaces

---

## 4. Ask Before Major Changes

Agents must request confirmation before:

* changing folder structure
* introducing frameworks
* altering database schema
* modifying authentication logic
* removing large code sections

---

# Development Commands

Use these commands when working with the project.

### Install dependencies

```
npm install
```

or

```
pnpm install
```

---

### Run development server

```
npm run dev
```

---

### Build project

```
npm run build
```

---

### Run tests

```
npm test
```

---

### Lint code

```
npm run lint
```

---

# Project Structure

Agents should respect the following structure:

```
src/
  components/
  services/
  utils/
  hooks/
  types/
  config/

tests/
docs/
scripts/
```

Guidelines:

| Folder     | Purpose                   |
| ---------- | ------------------------- |
| components | UI components             |
| services   | business logic            |
| utils      | reusable helpers          |
| hooks      | custom hooks              |
| types      | TypeScript types          |
| config     | environment configuration |

Do not move files between modules without justification.

---

# Coding Standards

Follow the **existing style in the repository**.

General rules:

### Naming conventions

| Element   | Style      |
| --------- | ---------- |
| variables | camelCase  |
| functions | camelCase  |
| classes   | PascalCase |
| constants | UPPER_CASE |
| files     | kebab-case |

---

### Function Design

Functions should:

* do one task
* remain under ~50 lines
* have descriptive names

Example:

```
function calculateInvoiceTotal(items) {
  // compute final price
}
```

---

### Comments

Write comments for:

* complex logic
* algorithms
* edge cases

Avoid redundant comments.

Bad:

```
counter += 1 // increment counter
```

Better:

```
# Prevent overflow when reaching max retries
```

---

# Dependency Policy

Before adding dependencies, check:

1. Is it already implemented?
2. Is the package well maintained?
3. Is it widely adopted?

Avoid:

* unmaintained libraries
* large dependencies for small tasks

---

# Security Rules

Never:

* commit secrets
* expose API keys
* store credentials in code

Use environment variables:

```
.env
process.env.API_KEY
```

---

# Testing Policy

Agents should add tests when:

* implementing new features
* fixing bugs
* modifying core logic

Tests should cover:

* edge cases
* error handling
* critical workflows

Example structure:

```
tests/
  auth.test.js
  payment.test.js
```

---

# Logging

Use structured logging when possible.

Example:

```
logger.info("User created", { userId })
```

Avoid excessive console logs.

---

# Error Handling

Always handle errors explicitly.

Example:

```
try {
  await service.process()
} catch (error) {
  logger.error(error)
  throw error
}
```

Never swallow exceptions silently.

---

# Documentation

When adding features, update:

```
README.md
docs/
```

Documentation should include:

* usage examples
* configuration details
* API changes

---

# Commit Message Format

Agents should generate clear commit messages.

Format:

```
feat: add authentication middleware
fix: resolve payment timeout bug
refactor: simplify order validation
docs: update API documentation
test: add unit tests for user service
```

---

# AI Workflow

Recommended workflow for agents:

1. Analyze problem
2. Locate relevant code
3. Plan minimal change
4. Implement patch
5. Run tests
6. Update docs if needed

---

# When Unsure

If uncertain:

* explain the ambiguity
* propose options
* ask the developer

Never fabricate unknown behavior.

---

# Priority Order

If instructions conflict, follow this order:

1. Explicit developer instructions
2. This `AGENTS.md`
3. Existing code patterns
4. Standard best practices

---

# End Goal

The agent's purpose is to:

* assist development
* improve code quality
* accelerate iteration
* maintain project stability

Not to **rewrite the codebase**.