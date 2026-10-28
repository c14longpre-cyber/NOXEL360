#!/usr/bin/env node
/**
 * NOXEL360 — sitemaps de frontend/public, générés à partir des pages réelles.
 * Ne jamais les modifier à la main : relancer ce script après tout ajout,
 * retrait ou renommage de page (après build-learn-hreflang.mjs).
 *
 *   sitemap.xml            index (l'adresse citée dans robots.txt)
 *   sitemap-core.xml       accueil, /pricing/, /learn/
 *   sitemap-learn.xml      pages Learn en anglais
 *   sitemap-learn-i18n.xml pages Learn traduites (/learn/<langue>/…)
 *
 * Une page n'est listée que si sa canonical est sa propre adresse et qu'elle
 * n'a pas de noindex. lastmod = date du dernier commit qui a touché le fichier
 * (aujourd'hui s'il a des modifications non commitées).
 *
 *   node scripts/build-sitemap.mjs          (écrit)
 *   node scripts/build-sitemap.mjs --check  (code 1 si un sitemap est périmé)
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://noxel360.com";
const here = path.dirname(fileURLToPath(import.meta.url));
const FRONT = path.resolve(here, "..");
const PUBLIC = path.join(FRONT, "public");
const CHECK = process.argv.includes("--check");
const TODAY = new Date().toISOString().slice(0, 10);

function git(args) {
  try {
    return execFileSync("git", args, { cwd: FRONT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return "";
  }
}

/** Dernière date de commit par fichier (chemins relatifs à frontend/). */
function commitDates() {
  const dates = new Map();
  const prefix = git(["rev-parse", "--show-prefix"]).trim();
  let current = null;
  for (const line of git(["log", "--format=@%cs", "--name-only", "--", "."]).split("\n")) {
    if (line.startsWith("@")) current = line.slice(1);
    else if (line && current) {
      const rel = line.startsWith(prefix) ? line.slice(prefix.length) : line;
      if (!dates.has(rel)) dates.set(rel, current);
    }
  }
  const dirty = new Set(
    git(["status", "--porcelain", "--", "."])
      .split("\n")
      .filter(Boolean)
      .map((l) => l.slice(3).split(" -> ").pop())
      .map((p) => (p.startsWith(prefix) ? p.slice(prefix.length) : p)),
  );
  return (rel) => (dirty.has(rel) || !dates.has(rel) ? TODAY : dates.get(rel));
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/** Adresse publique d'un fichier de public/ (index.html → dossier). */
function urlOf(file) {
  const rel = path.relative(PUBLIC, file).split(path.sep).join("/");
  return `${ORIGIN}/${rel.replace(/(^|\/)index\.html$/, "$1")}`;
}

function indexable(html, url) {
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) return false;
  const m = html.match(/<link rel="canonical" href="([^"]+)"/);
  return !!m && m[1] === url;
}

function urlset(entries) {
  const body = entries
    .map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function build() {
  const lastmodOf = commitDates();
  const rel = (f) => path.relative(FRONT, f).split(path.sep).join("/");
  const core = [];
  const learn = [];
  const learnI18n = [];

  // Accueil : la page servie à / est frontend/index.html (entrée Vite)
  core.push({ loc: `${ORIGIN}/`, lastmod: lastmodOf("index.html") });

  for (const file of walk(PUBLIC).sort()) {
    const url = urlOf(file);
    const html = fs.readFileSync(file, "utf8");
    if (!indexable(html, url)) continue;
    const entry = { loc: url, lastmod: lastmodOf(rel(file)) };
    if (url === `${ORIGIN}/learn/`) core.push(entry);
    else if (/^https:\/\/noxel360\.com\/learn\/[^/]+\.html$/.test(url)) learn.push(entry);
    else if (url.startsWith(`${ORIGIN}/learn/`)) learnI18n.push(entry);
    else core.push(entry);
  }

  const parts = {
    "sitemap-core.xml": core,
    "sitemap-learn.xml": learn,
    "sitemap-learn-i18n.xml": learnI18n,
  };
  const files = {};
  for (const [name, entries] of Object.entries(parts)) files[name] = urlset(entries);
  const newest = (entries) => entries.reduce((a, e) => (e.lastmod > a ? e.lastmod : a), "");
  files["sitemap.xml"] =
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    Object.entries(parts)
      .map(([name, entries]) => `  <sitemap>\n    <loc>${ORIGIN}/${name}</loc>\n    <lastmod>${newest(entries)}</lastmod>\n  </sitemap>`)
      .join("\n") +
    `\n</sitemapindex>\n`;
  return { files, counts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, v.length])) };
}

function main() {
  const { files, counts } = build();
  let stale = 0;
  for (const [name, xml] of Object.entries(files)) {
    const p = path.join(PUBLIC, name);
    const before = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
    if (before !== xml) {
      stale++;
      if (!CHECK) fs.writeFileSync(p, xml);
    }
  }
  console.log(Object.entries(counts).map(([k, n]) => `${k}: ${n}`).join(", "));
  if (CHECK && stale) {
    console.error(`${stale} sitemap(s) périmé(s) : node scripts/build-sitemap.mjs`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
