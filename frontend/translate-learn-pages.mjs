#!/usr/bin/env node
// NOXEL360 — Learn Section Translation Generator
// Adapted from NOXEL SEO's translate-pages.mjs — same engine, applied to the
// 127 Learn articles + 15 pillar hubs + main Learn index.
//
// Usage:
//   node translate-learn-pages.mjs                      → translate only missing pages
//   node translate-learn-pages.mjs --force               → regenerate ALL, overwriting existing
//   node translate-learn-pages.mjs --force --only=fr,es  → regenerate only specific languages
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

// Full 112-language set — identical to NOXEL SEO's set, for ecosystem-wide consistency
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

// ── The 127 Learn articles + 15 pillar hubs + main Learn index ──────────────
const PILLAR_HUBS = [
  "development", "web-foundations", "artificial-intelligence", "automation",
  "security", "digital-marketing", "uxui", "ecommerce", "data-analytics",
  "infrastructure", "performance", "digital-transformation",
  "business-questions", "comparisons", "noxel360-ecosystem",
];

const ARTICLE_SLUGS = [
  "what-is-an-api","what-is-front-end-development","what-is-back-end-development",
  "what-is-full-stack-development","what-is-a-database","what-is-devops",
  "what-are-microservices","what-is-version-control-git","what-is-continuous-integration",
  "what-is-a-website","what-is-a-domain-name","what-is-dns","what-is-an-ip-address",
  "http-vs-https","what-is-ssl-tls","what-is-web-hosting","what-is-cloud-computing",
  "what-is-a-cdn","what-is-bandwidth","what-is-uptime",
  "what-is-artificial-intelligence","what-is-machine-learning","what-is-generative-ai",
  "what-are-ai-agents","what-is-prompt-engineering","what-is-rag",
  "ai-automation-vs-ai-agent","how-businesses-use-ai","ai-risks-and-limitations",
  "what-is-business-automation","what-is-workflow-automation","what-is-process-automation",
  "what-is-rpa","what-is-event-driven-automation","what-is-api-integration","what-are-webhooks",
  "what-is-cybersecurity","common-cyber-threats","what-is-mfa","password-managers-explained",
  "what-is-data-encryption","firewalls-explained","backup-strategies",
  "what-is-disaster-recovery","what-is-zero-trust-security",
  "what-is-seo","what-is-local-seo","what-is-technical-seo","what-is-geo","what-is-sem",
  "what-is-ppc","what-is-content-marketing","what-is-email-marketing","what-is-cro",
  "what-is-ab-testing",
  "what-is-ux","what-is-ui","responsive-design-explained","mobile-first-design-explained",
  "web-accessibility-wcag-explained","what-is-a-user-journey","wireframes-vs-mockups-explained",
  "what-is-a-design-system",
  "what-is-ecommerce","what-is-a-shopping-cart","what-is-a-payment-gateway",
  "what-is-dropshipping","what-is-a-marketplace","what-is-inventory-management",
  "what-is-a-pos-system","cart-abandonment-explained",
  "what-is-web-analytics","what-is-google-search-console","what-are-kpis",
  "what-is-a-conversion-funnel","what-is-google-analytics-4","bounce-rate-explained",
  "what-is-a-dashboard","data-driven-decision-making-explained",
  "what-is-a-server","what-are-containers","what-is-kubernetes","what-is-serverless-computing",
  "what-is-load-balancing","what-is-infrastructure-as-code","what-is-a-reverse-proxy",
  "what-is-edge-computing",
  "what-is-page-speed","what-are-core-web-vitals","what-is-image-optimization",
  "what-is-browser-caching","what-is-lazy-loading","what-is-minification",
  "what-is-time-to-first-byte","why-website-performance-matters-explained",
  "what-is-digital-transformation","what-is-erp","what-is-a-crm","what-is-a-cms",
  "what-is-saas","what-is-a-tech-stack","cloud-migration-explained","legacy-systems-explained",
  "do-i-need-a-website-explained","how-much-does-a-website-cost-explained",
  "wordpress-vs-website-builder-explained","do-i-need-a-developer-or-diy-explained",
  "how-much-to-spend-on-marketing-explained","is-my-business-ready-for-automation-explained",
  "outsource-vs-hire-in-house-explained","how-long-does-seo-take-explained",
  "rest-vs-graphql-explained","sql-vs-nosql-explained","monolith-vs-microservices-explained",
  "shopify-vs-woocommerce-explained","agile-vs-waterfall-explained",
  "saas-vs-custom-software-explained","b2b-vs-b2c-explained","cloud-vs-on-premises-explained",
  "what-is-noxel360","what-is-noxel-seo","what-is-noxel-forge","what-is-nexus",
  "noxel-seo-features-explained","what-is-trust-score-forge-explained",
  "how-noxel-seo-and-forge-connect-explained","noxel360-ai-copilot-explained",
];

const PAGES = [
  { src: "index.html", out: "index.html", desc: "Learn — main index" },
  ...PILLAR_HUBS.map(h => ({ src: `${h}.html`, out: `${h}.html`, desc: `Pillar hub — ${h}` })),
  ...ARTICLE_SLUGS.map(s => ({ src: `${s}.html`, out: `${s}.html`, desc: `Article — ${s}` })),
];

console.log(`Total pages to translate per language: ${PAGES.length} (1 index + ${PILLAR_HUBS.length} hubs + ${ARTICLE_SLUGS.length} articles)`);

const LEARN_DIR = path.join(__dirname, "public", "learn");

async function translateHtml(html, targetLang, langCode, isRtl) {
  const prompt = `You are a professional web translator. Translate the following HTML page from English to ${targetLang}.

CRITICAL RULES:
1. Translate ONLY the visible text content (text between tags, alt text, title attributes, meta content attributes, aria-label attributes)
2. DO NOT translate: URLs, href values, src values, CSS classes, IDs, schema.org JSON-LD @type/@context values (except "name", "description", "headline", "text" fields inside JSON-LD, which SHOULD be translated)
3. DO NOT change the HTML structure, tags, or attributes other than lang/dir
4. For the <html lang="en"> tag, change it to <html lang="${langCode}"${isRtl ? ' dir="rtl"' : ""}>
5. Keep brand names unchanged: "NOXEL360", "NOXEL SEO", "NOXEL Forge", "NOXEL Nexus", "Claude", "Claude AI", "Anthropic", "Google", "Google Search Console", "ChatGPT", "Perplexity", "Gemini", "GitHub", "WordPress", "Shopify", "WooCommerce"
6. Keep technical acronyms in their standard form or use the ${targetLang} equivalent if one is standard: "SEO", "API", "URL", "HTML", "CSS", "JSON", "JSON-LD", "AEO", "GEO", "SXO", "Core Web Vitals", "LCP", "CLS", "INP", "TBT", "CDN", "DNS", "SSL", "HTTPS", "CRM", "ERP", "CMS", "SaaS", "REST", "GraphQL", "SQL", "NoSQL"
7. Update <title> and meta description/og/twitter tags to be in ${targetLang}
8. Return ONLY the complete translated HTML, nothing else — no preamble, no code fences

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
      max_tokens: 20000,
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

function addHreflangTags(html, pageName) {
  const enPath = pageName === "index.html" ? "" : pageName;
  const hreflangTags = [
    `  <link rel="alternate" hreflang="en" href="https://noxel360.com/learn/${enPath}" />`,
    ...LANGUAGES.map(l =>
      `  <link rel="alternate" hreflang="${l.htmlLang}" href="https://noxel360.com/learn/${l.code}/${enPath}" />`
    ),
    `  <link rel="alternate" hreflang="x-default" href="https://noxel360.com/learn/${enPath}" />`,
  ].join("\n");

  const stripped = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/>\n?/g, "");
  return stripped.replace("</head>", `${hreflangTags}\n</head>`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("🌍 NOXEL360 — Learn Translation Generator");
  console.log(`📄 Pages: ${PAGES.length} (index + ${PILLAR_HUBS.length} hubs + ${ARTICLE_SLUGS.length} articles)`);
  console.log(`🗣️  Languages: ${ACTIVE_LANGUAGES.length} (${ACTIVE_LANGUAGES.map(l => l.code).join(", ")})`);
  console.log(`🔁 Mode: ${FORCE ? "FORCE (overwrite existing)" : "SKIP existing"}\n`);

  console.log("📌 Refreshing hreflang tags on English originals...");
  for (const page of PAGES) {
    const srcPath = path.join(LEARN_DIR, page.src);
    if (!fs.existsSync(srcPath)) {
      console.log(`  ⚠️  ${page.src} not found, skipping`);
      continue;
    }
    const html = fs.readFileSync(srcPath, "utf8");
    const withHreflang = addHreflangTags(html, page.src);
    fs.writeFileSync(srcPath, withHreflang);
    console.log(`  ✅ hreflang refreshed on ${page.src}`);
  }

  let total = 0;
  let skipped = 0;
  const errors = [];

  for (const lang of ACTIVE_LANGUAGES) {
    const langDir = path.join(LEARN_DIR, lang.code);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

    console.log(`\n🌐 Translating to ${lang.name} (${lang.code})...`);

    for (const page of PAGES) {
      const srcPath = path.join(LEARN_DIR, page.src);
      if (!fs.existsSync(srcPath)) continue;

      const outPath = path.join(langDir, page.out);

      if (!FORCE && fs.existsSync(outPath)) {
        console.log(`  ⏭️  ${page.src} → ${lang.code}/ (already exists, use --force to regenerate)`);
        skipped++;
        continue;
      }

      try {
        process.stdout.write(`  🔄 Translating ${page.src}...`);
        const html = fs.readFileSync(srcPath, "utf8");

        const translated = await translateHtml(html, lang.name, lang.htmlLang, lang.dir === "rtl");

        const finalHtml = translated
          .replace(
            /href="https:\/\/noxel360\.com\/learn\/"/g,
            `href="https://noxel360.com/learn/${lang.code}/"`
          )
          .replace(
            /"url":\s*"https:\/\/noxel360\.com\/learn\/"/g,
            `"url": "https://noxel360.com/learn/${lang.code}/"`
          );

        fs.writeFileSync(outPath, finalHtml);
        total++;
        console.log(` ✅ saved to public/learn/${lang.code}/${page.out}`);
      } catch (err) {
        console.log(` ❌ ERROR: ${err.message}`);
        errors.push({ lang: lang.code, page: page.src, error: err.message });
      }

      await sleep(1200);
    }
  }

  console.log(`\n✅ Done! Generated ${total} translated pages (${skipped} skipped)`);
  if (errors.length) {
    console.log(`\n⚠️  ${errors.length} errors:`);
    errors.forEach(e => console.log(`  - ${e.lang}/${e.page}: ${e.error}`));
  }
}

main().catch(console.error);
