#!/usr/bin/env node
// NOXEL360 — Generate sitemap.xml entries for all Learn language variants
// Run after translate-learn-pages.mjs. Merges with the existing English-only
// sitemap.xml (from the earlier sitemap task) rather than replacing it.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://noxel360.com";
const TODAY = new Date().toISOString().split("T")[0];

const LANGUAGES = ["af","am","ar","az","be","bg","bn","bs","ca","ceb","co","cs","cy","da","de","el","en-AU","en-CA","en-GB","eo","es","es-AR","es-MX","et","eu","fa","fi","fr","fr-BE","fr-CA","fy","ga","gd","gl","gu","ha","haw","hi","hmn","hr","ht","hu","hy","id","ig","is","it","iw","ja","jw","ka","kk","km","kn","ko","ku","ky","la","lb","lo","lt","lv","mg","mi","mk","ml","mn","mr","ms","mt","my","ne","nl","no","ny","pa","pl","ps","pt","pt-BR","ro","ru","sd","si","sk","sl","sm","sn","so","sq","sr","st","su","sv","sw","ta","te","tg","th","tl","tr","uk","ur","uz","vi","xh","yi","yo","zh","zh-HK","zh-TW","zu"];

const PILLAR_HUBS = [
  "development", "web-foundations", "artificial-intelligence", "automation",
  "security", "digital-marketing", "uxui", "ecommerce", "data-analytics",
  "infrastructure", "performance", "digital-transformation",
  "business-questions", "comparisons", "noxel360-ecosystem",
];

// Only include languages/pages that actually exist on disk — running this
// right after a partial translation run (e.g. --only=fr,es) won't produce
// broken sitemap entries for languages not yet generated.
const LEARN_DIR = path.join(__dirname, "public", "learn");

function listArticleSlugsFromDisk() {
  return fs
    .readdirSync(LEARN_DIR)
    .filter(f => f.endsWith(".html") && f !== "index.html" && !PILLAR_HUBS.includes(f.replace(".html", "")))
    .map(f => f.replace(".html", ""));
}

const ARTICLE_SLUGS = listArticleSlugsFromDisk();
const ALL_PAGES = ["index.html", ...PILLAR_HUBS.map(h => `${h}.html`), ...ARTICLE_SLUGS.map(s => `${s}.html`)];

const urls = [];

// English originals (priority stays as set by the earlier sitemap task —
// this script only adds the translated variants)
for (const page of ALL_PAGES) {
  const p = page === "index.html" ? "" : page;
  urls.push({ loc: `${BASE}/learn/${p}`, priority: page === "index.html" ? "0.9" : "0.6" });
}

// Translated variants — only for languages that actually have a folder on disk
for (const langCode of LANGUAGES) {
  const langDir = path.join(LEARN_DIR, langCode);
  if (!fs.existsSync(langDir)) continue;

  for (const page of ALL_PAGES) {
    const outPath = path.join(langDir, page);
    if (!fs.existsSync(outPath)) continue; // skip pages not yet translated for this language
    const p = page === "index.html" ? "" : page;
    urls.push({ loc: `${BASE}/learn/${langCode}/${p}`, priority: page === "index.html" ? "0.7" : "0.4" });
  }
}

const xmlLines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
for (const { loc, priority } of urls) {
  xmlLines.push("  <url>");
  xmlLines.push(`    <loc>${loc}</loc>`);
  xmlLines.push(`    <lastmod>${TODAY}</lastmod>`);
  xmlLines.push("    <changefreq>monthly</changefreq>");
  xmlLines.push(`    <priority>${priority}</priority>`);
  xmlLines.push("  </url>");
}
xmlLines.push("</urlset>");

const outPath = path.join(__dirname, "public", "sitemap-learn-i18n.xml");
fs.writeFileSync(outPath, xmlLines.join("\n") + "\n");

console.log(`✅ Wrote ${urls.length} URLs to public/sitemap-learn-i18n.xml`);
console.log("⚠️  Remember: add this as a second <sitemap> entry in a sitemap index,");
console.log("   or merge its <url> entries into the main sitemap.xml manually.");
console.log("   With 100+ languages this file can get large — a sitemap INDEX");
console.log("   (pointing to sitemap.xml + sitemap-learn-i18n.xml) is the standard approach");
console.log("   once you're translating more than a handful of languages.");
