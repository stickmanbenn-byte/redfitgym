// LOCAL-ONLY placeholder asset generator.
// Reads every *.asset.json pointer under src/assets and writes a matching
// placeholder image into public/<url>, so Lovable-hosted assets resolve on the
// local dev server. Does NOT touch Lovable assets. Safe to delete public/__l5e.
import { readdirSync, readFileSync, mkdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import sharp from "sharp";

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

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// A single rotating weight plate on a near-black backdrop (so `screen` blend
// drops the background). `angle` drives visible rotation across frames.
function plateSVG(angle) {
  const W = 900, H = 900, cx = W / 2, cy = H / 2, R = 360;
  const bolts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + (angle * Math.PI) / 180;
    const bx = cx + Math.cos(a) * (R * 0.62);
    const by = cy + Math.sin(a) * (R * 0.62);
    return `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="16" fill="#0a0a0a" stroke="#3a3a3a" stroke-width="3"/>`;
  }).join("");
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * 180 + angle;
    return `<rect x="${cx - 4}" y="${cy - R * 0.9}" width="8" height="${R * 1.8}" rx="4" fill="#161616" transform="rotate(${a.toFixed(1)} ${cx} ${cy})"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#050505"/>
    <g transform="rotate(${angle.toFixed(1)} ${cx} ${cy})">
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="#1a1a1a" stroke="#2b2b2b" stroke-width="10"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#8a0f27" stroke-width="14" opacity="0.85"/>
      <circle cx="${cx}" cy="${cy}" r="${R * 0.82}" fill="#111" stroke="#333" stroke-width="6"/>
    </g>
    ${spokes}
    <circle cx="${cx}" cy="${cy}" r="${R * 0.5}" fill="#0d0d0d" stroke="#2a2a2a" stroke-width="8"/>
    ${bolts}
    <circle cx="${cx}" cy="${cy}" r="${R * 0.16}" fill="#050505" stroke="#444" stroke-width="10"/>
    <text x="${cx}" y="${cy + 12}" font-family="Arial Black, sans-serif" font-size="46" fill="#b01030" text-anchor="middle" font-weight="900">20</text>
  </svg>`;
}

// Generic labeled placeholder for people / before-after / dashboard images.
function labelSVG(label, w, h, kind) {
  const grad = kind === "dash"
    ? `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#141414"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient>`
    : `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#242020"/><stop offset="1" stop-color="#0c0c0c"/></linearGradient>`;
  const dash = kind === "dash"
    ? `<g font-family="Arial" fill="#f2f0ec">
         <rect x="40" y="40" width="${w-80}" height="${h-80}" rx="16" fill="#0e0e0e" stroke="#222"/>
         <text x="72" y="104" font-size="26" fill="#8a8781">LIVE SESSION</text>
         <text x="72" y="180" font-size="64" font-weight="900">12.4 <tspan font-size="24" fill="#b01030">km/h</tspan></text>
         <text x="72" y="250" font-size="34">5.2 km · 24:18 · 412 kcal</text>
         <text x="72" y="320" font-size="40" fill="#f43f5e">♥ 148 bpm</text>
       </g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>${grad}</defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    ${dash}
    <text x="${w/2}" y="${kind === "dash" ? h-40 : h/2}" font-family="Arial, sans-serif" font-size="${Math.max(20, Math.round(w/16))}" fill="#6a6a6a" text-anchor="middle" font-weight="700">${esc(label)}</text>
  </svg>`;
}

const files = walk(ASSET_DIR);
let n = 0;
for (const f of files) {
  const meta = JSON.parse(readFileSync(f, "utf8"));
  if (!meta.url) continue;
  const outPath = join(PUBLIC, meta.url.replace(/^\//, ""));
  mkdirSync(dirname(outPath), { recursive: true });
  const name = (meta.original_filename || "").toLowerCase();
  const png = meta.content_type === "image/png" || name.endsWith(".png");

  let svg;
  if (name.startsWith("ezgif-frame")) {
    const m = name.match(/(\d+)/);
    const idx = m ? parseInt(m[1], 10) : 0;
    svg = plateSVG((idx / 151) * 320); // ~0.9 turn across the sequence
  } else if (name.includes("dashboard")) {
    svg = labelSVG("FITNESS DASHBOARD", 680, 460, "dash");
  } else if (/before/.test(name)) {
    svg = labelSVG("BEFORE", 800, 1000, "person");
  } else if (/after/.test(name)) {
    svg = labelSVG("AFTER", 800, 1000, "person");
  } else {
    const nm = name.replace(/\.(jpg|jpeg|png)$/, "").replace(/_/g, " ").toUpperCase();
    svg = labelSVG(nm || "COACH", 800, 1000, "person");
  }

  const img = sharp(Buffer.from(svg));
  await (png ? img.png() : img.jpeg({ quality: 82 })).toFile(outPath);
  n++;
}
console.log(`Generated ${n} local placeholder assets into public/__l5e`);
