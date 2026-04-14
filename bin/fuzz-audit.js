#!/usr/bin/env node

const { execSync } = require("child_process");
const { readFileSync } = require("fs");
const { join } = require("path");

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "file":
    randomFile(args[0] || ".");
    break;
  case "line":
    if (!args[0]) {
      console.error("Usage: fuzz-audit line <file>");
      process.exit(1);
    }
    randomLine(args[0]);
    break;
  default:
    console.log("Usage: fuzz-audit <command> [args]\n");
    console.log("Commands:");
    console.log("  file [dir]    Pick a random git-tracked file");
    console.log("  line <file>   Pick a random line from a file");
    process.exit(command ? 1 : 0);
}

function randomFile(dir) {
  let output;
  try {
    output = execSync(
      `git -C "${dir}" ls-files --cached --others --exclude-standard`,
      { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    );
  } catch {
    console.error(`No git repository found in ${dir}`);
    process.exit(1);
  }

  const files = output
    .split("\n")
    .filter(Boolean)
    .map((f) => join(dir, f));

  if (files.length === 0) {
    console.error(`No files found in ${dir}`);
    process.exit(1);
  }

  const index = Math.floor(Math.random() * files.length);
  console.log(files[index]);
}

function randomLine(file) {
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    console.error(`Cannot read ${file}`);
    process.exit(1);
  }

  const lines = content.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  if (lines.length === 0) {
    console.error(`No lines found in ${file}`);
    process.exit(1);
  }

  const index = Math.floor(Math.random() * lines.length);
  console.log(`${index + 1}:${lines[index]}`);
}
