# fuzz-audit

Randomly select a location in your codebase and audit the surrounding code. Surfaces bugs, missing tests, documentation drift, and improvement opportunities that hide in code nobody's looked at in a while.

## Install

### npm

```bash
npm install -g fuzz-audit
```

### skill.sh

```bash
npx skills.sh install modularcloud/fuzz-audit
```

### Claude Code skill

```bash
claude skill install --from https://github.com/modularcloud/fuzz-audit fuzz-audit
```

## CLI

```
fuzz-audit file [dir]    Pick a random git-tracked file
fuzz-audit line <file>   Pick a random line from a file
```

## Usage

Run the skill in Claude Code:

```
/fuzz-audit
```

## What it does

1. Picks a random code file (respects `.gitignore`)
2. Picks a random line in that file
3. Identifies the function/method containing that line
4. Audits the code for:
   - Implementation bugs and security issues
   - Misuse across the codebase
   - Missing or weak test coverage
   - Documentation drift
   - Robustness, idiomacy, and performance improvements
5. Creates GitHub issues for any problems found

## Requirements

- Node.js >= 18
- Git
- [GitHub CLI](https://cli.github.com/) (`gh`) for issue creation
- [Claude Code](https://claude.ai/claude-code) for the audit skill
