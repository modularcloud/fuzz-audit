# fuzz-audit

Randomly select a location in your codebase and audit the surrounding code. Surfaces bugs, missing tests, documentation drift, and improvement opportunities that hide in code nobody's looked at in a while.

## Setup

1. Copy `random-file.sh` and `random-line.sh` to the root of your repo:

```bash
curl -O https://raw.githubusercontent.com/modularcloud/fuzz-audit/main/random-file.sh
curl -O https://raw.githubusercontent.com/modularcloud/fuzz-audit/main/random-line.sh
chmod +x random-file.sh random-line.sh
```

2. Install the Claude Code skill:

```bash
claude skill install --from https://github.com/modularcloud/fuzz-audit fuzz-audit
```

3. Run it:

```
/fuzz-audit
```

## What it does

1. Picks a random code file using `random-file.sh` (respects `.gitignore`, skips dotfiles)
2. Picks a random line in that file using `random-line.sh`
3. Identifies the function/method containing that line
4. Audits the code for:
   - Implementation bugs and security issues
   - Misuse across the codebase
   - Missing or weak test coverage
   - Documentation drift
   - Robustness, idiomacy, and performance improvements
5. Creates GitHub issues for any problems found

## Requirements

- Bash
- Git
- [GitHub CLI](https://cli.github.com/) (`gh`) for issue creation
- [Claude Code](https://claude.ai/claude-code)
