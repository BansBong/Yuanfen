#!/usr/bin/env node
/**
 * Lists everything that still contains the word PLACEHOLDER (or a fake contact value).
 *
 *   npm run check:placeholders            list outstanding placeholders
 *   npm run check:placeholders -- --strict  same, but exit with code 1 if any remain
 *   (automatic) prebuild                  prints a LOUD warning when NEXT_PUBLIC_SITE_MODE=live
 *                                         and placeholders remain. It never fails the build.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "messages", "supabase"];
const EXTENSIONS = new Set([".ts", ".tsx", ".json", ".sql", ".md"]);
// Files whose use of the word is part of the mechanism itself, not content.
const IGNORE_FILES = new Set([
  join("src", "components", "ui", "PlaceholderBadge.tsx"),
  join("src", "lib", "site-mode.ts"),
]);
// "PLACEHOLDER" as a standalone marker (not part of a longer word such as PLACEHOLDERS.md).
const MARKER = /(?<![A-Za-z])PLACEHOLDER(?![A-Za-z])/;
const IGNORE_LINE = /SHOW_PLACEHOLDER_BADGES|PlaceholderBadge/;

const args = new Set(process.argv.slice(2));
const strict = args.has("--strict");
const buildMode = args.has("--build");

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(name.slice(name.lastIndexOf(".")))) yield full;
  }
}

/** Read NEXT_PUBLIC_SITE_MODE from the environment, falling back to .env files (Next loads them later than prebuild). */
function siteMode() {
  if (process.env.NEXT_PUBLIC_SITE_MODE) return process.env.NEXT_PUBLIC_SITE_MODE;
  for (const file of [".env.production.local", ".env.local", ".env.production", ".env"]) {
    const path = join(ROOT, file);
    if (!existsSync(path)) continue;
    const m = readFileSync(path, "utf8").match(/^\s*NEXT_PUBLIC_SITE_MODE\s*=\s*"?([\w-]+)"?/m);
    if (m) return m[1];
  }
  return "coming-soon";
}

const hits = new Map(); // file -> [{ line, text }]
for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    if (IGNORE_FILES.has(rel)) continue;
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .forEach((text, i) => {
        if (MARKER.test(text) && !IGNORE_LINE.test(text)) {
          if (!hits.has(rel)) hits.set(rel, []);
          hits.get(rel).push({ line: i + 1, text: text.trim().slice(0, 110) });
        }
      });
  }
}

// Contact values that are still fake (value contains PLACEHOLDER, or is all zeros).
const contacts = [];
const placeholdersFile = join(ROOT, "src", "data", "placeholders.ts");
if (existsSync(placeholdersFile)) {
  const src = readFileSync(placeholdersFile, "utf8");
  for (const m of src.matchAll(/export const (\w+) = "([^"]*)"/g)) {
    if (MARKER.test(m[2]) || /^0+$/.test(m[2])) contacts.push(`${m[1]} = "${m[2]}"`);
  }
}

const total = [...hits.values()].reduce((n, list) => n + list.length, 0);
const mode = siteMode();

if (buildMode) {
  if (mode === "live" && (total > 0 || contacts.length > 0)) {
    const bar = "!".repeat(78);
    console.warn(`\n${bar}`);
    console.warn("!!  WARNING: building in LIVE mode but PLACEHOLDER content is still in the site.");
    console.warn(`!!  ${total} placeholder line(s) in ${hits.size} file(s); ${contacts.length} fake contact value(s).`);
    console.warn("!!  Visitors on yuanfenbridge.com WILL see this. Run: npm run check:placeholders");
    console.warn("!!  and follow PLACEHOLDERS.md before launching.");
    console.warn(`${bar}\n`);
  } else {
    console.log(`[placeholders] mode=${mode}; ${total} placeholder line(s) outstanding (run "npm run check:placeholders" to list).`);
  }
  process.exit(0);
}

console.log(`\nPLACEHOLDER check (site mode: ${mode})\n${"=".repeat(60)}`);
if (contacts.length) {
  console.log("\nFake contact values in src/data/placeholders.ts:");
  contacts.forEach((c) => console.log(`  - ${c}`));
}
for (const [file, list] of [...hits.entries()].sort()) {
  console.log(`\n${file.split(sep).join("/")}  (${list.length})`);
  list.forEach((h) => console.log(`  ${String(h.line).padStart(4)}  ${h.text}`));
}
console.log(`\n${total} placeholder line(s) in ${hits.size} file(s), ${contacts.length} fake contact value(s).`);
console.log("See PLACEHOLDERS.md for what to replace and where.\n");
process.exit(strict && (total > 0 || contacts.length > 0) ? 1 : 0);
