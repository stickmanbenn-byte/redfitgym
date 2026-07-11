// Copies the REAL image files the user placed next to each *.asset.json pointer
// into public/<url>, so the existing /__l5e/... URLs serve the real images
// (locally and in any static deploy like Netlify). Falls back silently when a
// real file isn't present.
import { readdirSync, readFileSync, existsSync, mkdirSync, copyFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const ROOT = resolve(process.cwd());
const ASSET_DIR = join(ROOT, "src", "assets");
const PUBLIC = join(ROOT, "public");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".asset.json")) out.push(p);
  }
  return out;
}

let copied = 0, missing = [];
for (const pointer of walk(ASSET_DIR)) {
  const meta = JSON.parse(readFileSync(pointer, "utf8"));
  if (!meta.url) continue;
  const source = pointer.replace(/\.asset\.json$/, ""); // real file sits beside the pointer
  const dest = join(PUBLIC, meta.url.replace(/^\//, ""));
  if (!existsSync(source)) { missing.push(source.replace(ROOT + "\\", "").replace(ROOT + "/", "")); continue; }
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(source, dest);
  copied++;
}
console.log(`Copied ${copied} real assets into public/__l5e`);
if (missing.length) console.log(`Missing (${missing.length}): ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? " ..." : ""}`);
