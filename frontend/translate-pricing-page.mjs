#!/usr/bin/env node
// NOXEL360 — Pricing Page Translation Generator
// Same engine as translate-learn-pages.mjs, applied to public/pricing/index.html only.
//
// Usage:
//   node translate-pricing-page.mjs                      → translate only missing languages
//   node translate-pricing-page.mjs --force               → regenerate ALL, overwriting existing
//   node translate-pricing-page.mjs --force --only=fr,es  → regenerate only specific languages
// Requires: ANTHROPIC_API_KEY in environment

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error("❌ Missing ANTHROPIC_API_KEY");
  process.exit(1);
}

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const onlyArg = args.find(a => a.startsWith("--only="));
const ONLY_CODES = onlyArg ? onlyArg.replace("--only=", "").split(",").map(s => s.trim()) : null;

// Same 112-language set used across the ecosystem (NOXEL SEO + Learn)
const LANGUAGES = [
  { code: "af", name: "Afrikaans", dir: "ltr", htmlLang: "af" },
  { code: "am", name: "Amharic", dir: "ltr", htmlLang: "am" },
  { code: "ar", name: "Arabic", dir: "rtl", htmlLang: "ar" },
  { code: "az", name: "Azerbaijani", dir: "ltr", htmlLang: "az" },
  { code: "be", name: "Belarusian", dir: "ltr", htmlLang: "be" },
  { code: "bg", name: "Bulgarian", dir: "ltr", htmlLang: "bg" },
  { code: "bn", name: "Bengali", dir: "ltr", htmlLang: "bn" },
  { code: "bs", name: "Bosnian", dir: "ltr", htmlLang: "bs" },
  { code: "ca", name: "Catalan", dir: "ltr", htmlLang: "ca" },
  { code: "ceb", name: "Cebuano", dir: "ltr", htmlLang: "ceb" },
  { code: "co", name: "Corsican", dir: "ltr", htmlLang: "co" },
  { code: "cs", name: "Czech", dir: "ltr", htmlLang: "cs" },
  { code: "cy", name: "Welsh", dir: "ltr", htmlLang: "cy" },
  { code: "da", name: "Danish", dir: "ltr", htmlLang: "da" },
  { code: "de", name: "German", dir: "ltr", htmlLang: "de" },
  { code: "el", name: "Greek", dir: "ltr", htmlLang: "el" },
  { code: "en-AU", name: "English (Australia)", dir: "ltr", htmlLang: "en-AU" },
  { code: "en-CA", name: "English (Canada)", dir: "ltr", htmlLang: "en-CA" },
  { code: "en-GB", name: "English (UK)", dir: "ltr", htmlLang: "en-GB" },
  { code: "eo", name: "Esperanto", dir: "ltr", htmlLang: "eo" },
  { code: "es", name: "Spanish", dir: "ltr", htmlLang: "es" },
  { code: "es-AR", name: "Spanish (Argentina)", dir: "ltr", htmlLang: "es-AR" },
  { code: "es-MX", name: "Spanish (Mexico)", dir: "ltr", htmlLang: "es-MX" },
  { code: "et", name: "Estonian", dir: "ltr", htmlLang: "et" },
  { code: "eu", name: "Basque", dir: "ltr", htmlLang: "eu" },
  { code: "fa", name: "Persian", dir: "rtl", htmlLang: "fa" },
  { code: "fi", name: "Finnish", dir: "ltr", htmlLang: "fi" },
  { code: "fr", name: "French", dir: "ltr", htmlLang: "fr" },
  { code: "fr-BE", name: "French (Belgium)", dir: "ltr", htmlLang: "fr-BE" },
  { code: "fr-CA", name: "French (Canada)", dir: "ltr", htmlLang: "fr-CA" },
  { code: "fy", name: "Frisian", dir: "ltr", htmlLang: "fy" },
  { code: "ga", name: "Irish", dir: "ltr", htmlLang: "ga" },
  { code: "gd", name: "Scots Gaelic", dir: "ltr", htmlLang: "gd" },
  { code: "gl", name: "Galician", dir: "ltr", htmlLang: "gl" },
  { code: "gu", name: "Gujarati", dir: "ltr", htmlLang: "gu" },
  { code: "ha", name: "Hausa", dir: "ltr", htmlLang: "ha" },
  { code: "haw", name: "Hawaiian", dir: "ltr", htmlLang: "haw" },
  { code: "hi", name: "Hindi", dir: "ltr", htmlLang: "hi" },
  { code: "hmn", name: "Hmong", dir: "ltr", htmlLang: "hmn" },
  { code: "hr", name: "Croatian", dir: "ltr", htmlLang: "hr" },
  { code: "ht", name: "Haitian Creole", dir: "ltr", htmlLang: "ht" },
  { code: "hu", name: "Hungarian", dir: "ltr", htmlLang: "hu" },
  { code: "hy", name: "Armenian", dir: "ltr", htmlLang: "hy" },
  { code: "id", name: "Indonesian", dir: "ltr", htmlLang: "id" },
  { code: "ig", name: "Igbo", dir: "ltr", htmlLang: "ig" },
  { code: "is", name: "Icelandic", dir: "ltr", htmlLang: "is" },
  { code: "it", name: "Italian", dir: "ltr", htmlLang: "it" },
  { code: "iw", name: "Hebrew", dir: "rtl", htmlLang: "he" },
  { code: "ja", name: "Japanese", dir: "ltr", htmlLang: "ja" },
  { code: "jw", name: "Javanese", dir: "ltr", htmlLang: "jv" },
  { code: "ka", name: "Georgian", dir: "ltr", htmlLang: "ka" },
  { code: "kk", name: "Kazakh", dir: "ltr", htmlLang: "kk" },
  { code: "km", name: "Khmer", dir: "ltr", htmlLang: "km" },
  { code: "kn", name: "Kannada", dir: "ltr", htmlLang: "kn" },
  { code: "ko", name: "Korean", dir: "ltr", htmlLang: "ko" },
  { code: "ku", name: "Kurdish (Kurmanji)", dir: "ltr", htmlLang: "ku" },
  { code: "ky", name: "Kyrgyz", dir: "ltr", htmlLang: "ky" },
  { code: "la", name: "Latin", dir: "ltr", htmlLang: "la" },
  { code: "lb", name: "Luxembourgish", dir: "ltr", htmlLang: "lb" },
  { code: "lo", name: "Lao", dir: "ltr", htmlLang: "lo" },
  { code: "lt", name: "Lithuanian", dir: "ltr", htmlLang: "lt" },
  { code: "lv", name: "Latvian", dir: "ltr", htmlLang: "lv" },
  { code: "mg", name: "Malagasy", dir: "ltr", htmlLang: "mg" },
  { code: "mi", name: "Maori", dir: "ltr", htmlLang: "mi" },
  { code: "mk", name: "Macedonian", dir: "ltr", htmlLang: "mk" },
  { code: "ml", name: "Malayalam", dir: "ltr", htmlLang: "ml" },
  { code: "mn", name: "Mongolian", dir: "ltr", htmlLang: "mn" },
  { code: "mr", name: "Marathi", dir: "ltr", htmlLang: "mr" },
  { code: "ms", name: "Malay", dir: "ltr", htmlLang: "ms" },
  { code: "mt", name: "Maltese", dir: "ltr", htmlLang: "mt" },
  { code: "my", name: "Myanmar (Burmese)", dir: "ltr", htmlLang: "my" },
  { code: "ne", name: "Nepali", dir: "ltr", htmlLang: "ne" },
  { code: "nl", name: "Dutch", dir: "ltr", htmlLang: "nl" },
  { code: "no", name: "Norwegian", dir: "ltr", htmlLang: "no" },
  { code: "ny", name: "Chichewa", dir: "ltr", htmlLang: "ny" },
  { code: "pa", name: "Punjabi", dir: "ltr", htmlLang: "pa" },
  { code: "pl", name: "Polish", dir: "ltr", htmlLang: "pl" },
  { code: "ps", name: "Pashto", dir: "rtl", htmlLang: "ps" },
  { code: "pt", name: "Portuguese", dir: "ltr", htmlLang: "pt" },
  { code: "pt-BR", name: "Portuguese (Brazil)", dir: "ltr", htmlLang: "pt-BR" },
  { code: "ro", name: "Romanian", dir: "ltr", htmlLang: "ro" },
  { code: "ru", name: "Russian", dir: "ltr", htmlLang: "ru" },
  { code: "sd", name: "Sindhi", dir: "rtl", htmlLang: "sd" },
  { code: "si", name: "Sinhala", dir: "ltr", htmlLang: "si" },
  { code: "sk", name: "Slovak", dir: "ltr", htmlLang: "sk" },
  { code: "sl", name: "Slovenian", dir: "ltr", htmlLang: "sl" },
  { code: "sm", name: "Samoan", dir: "ltr", htmlLang: "sm" },
  { code: "sn", name: "Shona", dir: "ltr", htmlLang: "sn" },
  { code: "so", name: "Somali", dir: "ltr", htmlLang: "so" },
  { code: "sq", name: "Albanian", dir: "ltr", htmlLang: "sq" },
  { code: "sr", name: "Serbian", dir: "ltr", htmlLang: "sr" },
  { code: "st", name: "Sesotho", dir: "ltr", htmlLang: "st" },
  { code: "su", name: "Sundanese", dir: "ltr", htmlLang: "su" },
  { code: "sv", name: "Swedish", dir: "ltr", htmlLang: "sv" },
  { code: "sw", name: "Swahili", dir: "ltr", htmlLang: "sw" },
  { code: "ta", name: "Tamil", dir: "ltr", htmlLang: "ta" },
  { code: "te", name: "Telugu", dir: "ltr", htmlLang: "te" },
  { code: "tg", name: "Tajik", dir: "ltr", htmlLang: "tg" },
  { code: "th", name: "Thai", dir: "ltr", htmlLang: "th" },
  { code: "tl", name: "Filipino (Tagalog)", dir: "ltr", htmlLang: "tl" },
  { code: "tr", name: "Turkish", dir: "ltr", htmlLang: "tr" },
  { code: "uk", name: "Ukrainian", dir: "ltr", htmlLang: "uk" },
  { code: "ur", name: "Urdu", dir: "rtl", htmlLang: "ur" },
  { code: "uz", name: "Uzbek", dir: "ltr", htmlLang: "uz" },
  { code: "vi", name: "Vietnamese", dir: "ltr", htmlLang: "vi" },
  { code: "xh", name: "Xhosa", dir: "ltr", htmlLang: "xh" },
  { code: "yi", name: "Yiddish", dir: "rtl", htmlLang: "yi" },
  { code: "yo", name: "Yoruba", dir: "ltr", htmlLang: "yo" },
  { code: "zh", name: "Chinese (Simplified)", dir: "ltr", htmlLang: "zh-CN" },
  { code: "zh-HK", name: "Chinese (Hong Kong / Traditional)", dir: "ltr", htmlLang: "zh-HK" },
  { code: "zh-TW", name: "Chinese (Traditional)", dir: "ltr", htmlLang: "zh-TW" },
  { code: "zu", name: "Zulu", dir: "ltr", htmlLang: "zu" },
];

const ACTIVE_LANGUAGES = ONLY_CODES
  ? LANGUAGES.filter(l => ONLY_CODES.includes(l.code))
  : LANGUAGES;

const PRICING_DIR = path.join(__dirname, "public", "pricing");
const SRC_PATH = path.join(PRICING_DIR, "index.html");

async function translateHtml(html, targetLang, langCode, isRtl) {
  const prompt = `You are a professional web translator. Translate the following HTML page from English to ${targetLang}.

CRITICAL RULES:
1. Translate ONLY the visible text content (text between tags, alt text, title attributes, meta content attributes, aria-label attributes)
2. DO NOT translate: URLs, href values, src values, CSS classes, IDs (like id="plans", id="faq" — leave anchors untouched so in-page links keep working)
3. DO NOT change the HTML structure, tags, or attributes other than lang/dir
4. For the <html lang="en"> tag, change it to <html lang="${langCode}"${isRtl ? ' dir="rtl"' : ""}>
5. Keep brand names unchanged: "NOXEL360", "NOXEL SEO", "NOXEL Forge", "NOXEL Nexus"
6. Update <title> and meta description to be in ${targetLang}
7. Return ONLY the complete translated HTML, nothing else — no preamble, no code fences

HTML TO TRANSLATE:
${html}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${err}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function addHreflangTags(html) {
  const hreflangTags = [
    `  <link rel="alternate" hreflang="en" href="https://noxel360.com/pricing/" />`,
    ...LANGUAGES.map(l =>
      `  <link rel="alternate" hreflang="${l.htmlLang}" href="https://noxel360.com/pricing/${l.code}/" />`
    ),
    `  <link rel="alternate" hreflang="x-default" href="https://noxel360.com/pricing/" />`,
  ].join("\n");

  const stripped = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/>\n?/g, "");
  return stripped.replace("</head>", `${hreflangTags}\n</head>`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("🌍 NOXEL360 — Pricing Page Translation Generator");
  console.log(`🗣️  Languages: ${ACTIVE_LANGUAGES.length} (${ACTIVE_LANGUAGES.map(l => l.code).join(", ")})`);
  console.log(`🔁 Mode: ${FORCE ? "FORCE (overwrite existing)" : "SKIP existing"}\n`);

  if (!fs.existsSync(SRC_PATH)) {
    console.error(`❌ ${SRC_PATH} not found`);
    process.exit(1);
  }

  console.log("📌 Refreshing hreflang tags on English original...");
  const originalHtml = fs.readFileSync(SRC_PATH, "utf8");
  fs.writeFileSync(SRC_PATH, addHreflangTags(originalHtml));
  console.log("  ✅ hreflang refreshed on pricing/index.html\n");

  let total = 0;
  let skipped = 0;
  const errors = [];

  for (const lang of ACTIVE_LANGUAGES) {
    const langDir = path.join(PRICING_DIR, lang.code);
    const outPath = path.join(langDir, "index.html");

    if (!FORCE && fs.existsSync(outPath)) {
      console.log(`⏭️  ${lang.code} (already exists, use --force to regenerate)`);
      skipped++;
      continue;
    }

    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

    try {
      process.stdout.write(`🔄 Translating to ${lang.name} (${lang.code})...`);
      const html = fs.readFileSync(SRC_PATH, "utf8");

      const translated = await translateHtml(html, lang.name, lang.htmlLang, lang.dir === "rtl");

      // Assets (styles.css, app.js) are one level up in the English version;
      // translated pages live one directory deeper (public/pricing/{lang}/),
      // so relative paths need adjusting.
      const finalHtml = translated
        .replace(/href="\.\/assets\/styles\.css"/g, 'href="../assets/styles.css"')
        .replace(/src="\.\/assets\/app\.js"/g, 'src="../assets/app.js"')
        .replace(/href="\.\/tiers\//g, 'href="../tiers/')
        .replace(/href="\.\.\/"/g, 'href="../../"'); // "Dashboard"/back link one level further up

      fs.writeFileSync(outPath, finalHtml);
      total++;
      console.log(` ✅ saved to public/pricing/${lang.code}/index.html`);
    } catch (err) {
      console.log(` ❌ ERROR: ${err.message}`);
      errors.push({ lang: lang.code, error: err.message });
    }

    await sleep(1200);
  }

  console.log(`\n✅ Done! Generated ${total} translated pages (${skipped} skipped)`);
  if (errors.length) {
    console.log(`\n⚠️  ${errors.length} errors:`);
    errors.forEach(e => console.log(`  - ${e.lang}: ${e.error}`));
  }
}

main().catch(console.error);
