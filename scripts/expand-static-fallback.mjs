#!/usr/bin/env node
// scripts/expand-static-fallback.mjs
//
// Duplique dans le fallback statique de frontend/index.html le contenu déjà
// ajouté à LandingPage.tsx : la section "Built to Work Together" et les 2
// nouvelles questions FAQ. Le rapport NOXEL SEO (et tout crawler qui
// n'exécute pas JavaScript) lit ce fallback, pas le rendu React — sans ce
// script, le compte de mots reste bloqué à 401 quoi qu'on ajoute à
// LandingPage.tsx.
//
// Usage :
//   node scripts/expand-static-fallback.mjs            # applique
//   node scripts/expand-static-fallback.mjs --dry-run  # affiche seulement

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");
const PATH = join(ROOT, "frontend/index.html");

if (!existsSync(PATH)) {
  console.error(`❌ Fichier introuvable : ${PATH}`);
  process.exit(1);
}

const original = readFileSync(PATH, "utf8");
let content = original;
let changes = 0;

// ---------------------------------------------------------------------------
// 1. Section "Built to Work Together" — insérée juste avant le <h2> FAQ.
// ---------------------------------------------------------------------------
const CONNECT_HTML = `        <h2 style="font-size:22px;font-weight:800;margin:40px 0 20px;">Not Three Tools. One Connected Toolkit.</h2>
        <p style="font-size:16px;line-height:1.7;color:rgba(255,255,255,0.75);margin-bottom:16px;">
          Each module solves a distinct problem, but they're designed to inform each other instead
          of operating in isolation. A NOXEL SEO audit surfaces a site's visibility gaps — thin
          content, missing schema, slow Core Web Vitals. NOXEL Forge helps close the authority gap
          those audits often reveal, connecting a site with verified backlink partners instead of
          leaving link building as a manual, cold-outreach grind. NOXEL Nexus sits underneath both,
          detecting a visitor's language and region so the same underlying content and tooling
          adapt automatically — no separate localization project required.
        </p>
        <p style="font-size:16px;line-height:1.7;color:rgba(255,255,255,0.75);">
          The result isn't three disconnected tools that happen to share a login. It's a single
          account where an issue flagged in one module has a natural next step in another, instead
          of exporting a report and starting over somewhere else.
        </p>

`;

const FAQ_H2_ANCHOR = `        <h2 style="font-size:22px;font-weight:800;margin:40px 0 20px;">Frequently Asked Questions</h2>`;

if (content.includes(FAQ_H2_ANCHOR)) {
  content = content.replace(FAQ_H2_ANCHOR, CONNECT_HTML + FAQ_H2_ANCHOR);
  changes++;
} else {
  console.log("⚠ Ancre du <h2> FAQ introuvable — section 'Built to Work Together' NON ajoutée.");
}

// ---------------------------------------------------------------------------
// 2. Deux nouvelles questions FAQ — ajoutées juste avant la fermeture </dl>.
// ---------------------------------------------------------------------------
const NEW_FAQ_ITEMS = `
          <dt style="font-weight:700;color:#eef1f0;margin-bottom:6px;">How long does it take to see results?</dt>
          <dd style="margin:0 0 20px;">NOXEL SEO's free audit returns results in seconds — you'll see your visibility score and top issues immediately. NOXEL Forge backlink placements and ranking improvements from fixed technical issues typically show measurable movement within 4–8 weeks, consistent with normal search engine re-crawling and re-indexing timelines.</dd>

          <dt style="font-weight:700;color:#eef1f0;margin-bottom:6px;">Is my data shared between modules?</dt>
          <dd style="margin:0;">Only what's needed to make the modules useful together — for example, a site you've added to NOXEL SEO is available to reference in NOXEL Forge without re-entering it. NOXEL360 doesn't sell or share account data with third parties.</dd>
`;

// La dernière <dd> existante se termine par margin:0 (dernier élément de la
// liste, sans marge en bas) — on la fait passer à margin:"0 0 20px" pour
// faire de la place aux 2 nouvelles entrées, qui héritent du "dernier item".
const LAST_DD_OLD = `          <dd style="margin:0;">Yes. Each module stands on its own and can be enabled individually — you're not required to activate every module to use NOXEL360.</dd>
        </dl>`;

const LAST_DD_NEW = `          <dd style="margin:0 0 20px;">Yes. Each module stands on its own and can be enabled individually — you're not required to activate every module to use NOXEL360.</dd>
${NEW_FAQ_ITEMS}        </dl>`;

if (content.includes(LAST_DD_OLD)) {
  content = content.replace(LAST_DD_OLD, LAST_DD_NEW);
  changes++;
} else {
  console.log("⚠ Ancre de la dernière question FAQ introuvable — 2 nouvelles Q&A NON ajoutées.");
}

// ---------------------------------------------------------------------------
if (changes === 0) {
  console.log("\nAucun changement appliqué — vérifie les ancres manuellement.");
  process.exit(1);
}

console.log(`${DRY_RUN ? "[DRY RUN] Modifierait" : "Modifié"} : frontend/index.html (${changes}/2 remplacement(s) réussis)`);
console.log(`Ajout net : ~${content.length - original.length} caractères (~${Math.round((content.length - original.length) / 5.5)} mots)`);

if (!DRY_RUN) {
  writeFileSync(PATH + ".bak", original, "utf8");
  writeFileSync(PATH, content, "utf8");
}
