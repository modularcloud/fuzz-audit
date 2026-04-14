---
name: fuzz-audit
description: Randomly select a code location in the codebase and perform a comprehensive
  audit of the surrounding function/method. Use this skill when the user asks to fuzz
  audit, spot-check, randomly review, or do a random code audit of their codebase.
  Also trigger when the user wants to find random code quality issues, do a stochastic
  code review, or says "pick a random function and review it."
---

# Fuzz Audit

Randomly select a location in the codebase and deeply audit the code around it. The goal is to surface issues that wouldn't be caught by normal targeted reviews — the kind of things that hide in code nobody's looked at in a while.

## Step 1: Pick a random code location

Use the `fuzz-audit` CLI. It must be installed globally (`npm install -g fuzz-audit`) or available on PATH.

```bash
fuzz-audit file .
```

This returns a file path. Check if the file is source code (e.g., `.ts`, `.js`, `.py`, `.go`, `.rs`, `.java`, `.rb`, `.c`, `.cpp`, `.sh`, `.swift`, `.kt`, `.scala`, `.ex`, `.clj`, `.cs`, `.php`, `.lua`, `.zig`, `.ml`, `.hs`). If it's not code (config, JSON, markdown, images, lock files, etc.), run `fuzz-audit file` again until you get a code file. Cap retries at 10 — if the codebase has very few code files, report that and stop.

Once you have a code file, pick a random line:

```bash
fuzz-audit line <file>
```

This returns `<line_number>:<content>`. If the line is blank or a comment, run it again (up to 5 retries) to land on actual code.

## Step 2: Identify the audit target

Read the file and find the **immediate** enclosing construct around the selected line — the single function, method, closure, or object definition that directly contains it. If the line is inside a method inside a class, the target is the method, not the class. If the line is at module/top level, the target is the nearest top-level declaration.

Record:
- **File path** and **line range** of the target
- **Name** of the construct (e.g., `parseConfig`, `UserService.validate`, `handleRequest`)
- **The selected line** that led you here (for traceability)

## Step 3: Audit

Perform these audit checks. If subagents are available, run them in parallel — each check is independent.

### 3a. Implementation review

Read the full target construct. Look for:
- Bugs, off-by-one errors, race conditions, null/undefined hazards
- Security issues (injection, unvalidated input, leaked secrets, OWASP top 10)
- Error handling gaps — unhandled promise rejections, swallowed exceptions, missing edge cases
- Resource leaks (unclosed handles, missing cleanup)
- Dead code or unreachable branches

### 3b. Usage review

Search the codebase for all call sites and references to this construct. Look for:
- Misuse — wrong argument types, ignored return values, incorrect assumptions about behavior
- Inconsistent usage patterns across callers
- Tight coupling that could be loosened
- Unused exports (the construct is exported but never imported elsewhere)

### 3c. Test coverage

Search for tests that exercise this construct. Look for:
- Missing tests entirely — no test file references this function
- Untested branches or edge cases (compare the code paths in the implementation against what the tests cover)
- Tests that exist but are weak — only testing the happy path, using mocks that hide real behavior
- Flaky patterns (timing-dependent assertions, order-dependent tests)

### 3d. Documentation compliance

Search for documentation, specs, or READMEs in the codebase. If any exist that are relevant to this code:
- Check that the implementation matches documented behavior
- Flag any drift between docs and code (either could be wrong — note which seems more intentional)
- Note undocumented public APIs or behaviors

### 3e. Improvement opportunities

Consider whether the code could be:
- More **robust** — better error handling, defensive checks at system boundaries
- More **idiomatic** — following the conventions of the language and this specific codebase
- More **performant** — unnecessary allocations, O(n^2) where O(n) is possible, redundant work

Only flag improvements that are meaningful. Don't nitpick style or suggest changes for their own sake.

## Step 4: Report

Summarize your findings to the user. For each issue found, include:
- What the issue is
- Where it is (file path and line numbers)
- Why it matters (severity: bug, potential bug, code smell, improvement opportunity)
- A proposed fix if you have one

## Step 5: File issues

For each distinct issue found, create a GitHub issue using `gh`:

```bash
gh issue create --title "<concise title>" --body "<body>"
```

The issue body should include:
- **Found by:** fuzz-audit (random selection: `<file>:<line>` -> `<construct name>`)
- **Category:** one of `bug`, `potential-bug`, `missing-tests`, `docs-drift`, `code-smell`, `improvement`
- **Description:** what's wrong and why it matters
- **Location:** file path and line range
- **Proposed fix:** if you have one, describe the approach

If the audit finds no issues, say so — a clean audit is a valid result. Do not fabricate issues.
