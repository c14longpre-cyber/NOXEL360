#!/usr/bin/env node
// scripts/expand-landing-content.mjs
//
// Étend LandingPage.tsx pour :
//   1. Ajouter une section "How the Modules Connect" — explique la synergie
//      entre SEO/Forge/Nexus, absente ailleurs sur la page.
//   2. Ajouter une FAQ VISIBLE reprenant les 5 questions déjà présentes dans
//      le schema JSON-LD FAQPage (index.html) + 2 nouvelles — corrige le
//      décalage schema/contenu visible (déconseillé par Google) et fait
//      remonter le nombre de mots de ~401 vers ~950+.
//
// Usage :
//   node scripts/expand-landing-content.mjs            # applique
//   node scripts/expand-landing-content.mjs --dry-run  # affiche seulement

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");
const PATH = join(ROOT, "frontend/src/pages/LandingPage.tsx");

if (!existsSync(PATH)) {
  console.error(`❌ Fichier introuvable : ${PATH}`);
  process.exit(1);
}

const original = readFileSync(PATH, "utf8");
let content = original;

// ---------------------------------------------------------------------------
// 1. Section "How the Modules Connect" — insérée juste après la fermeture de
//    la section #how-it-works.
// ---------------------------------------------------------------------------
const CONNECT_SECTION = `
        <section id="connected">
          <div className="wrap">
            <div className="section-tag">Built to Work Together</div>
            <h2 className="section-title">Not three tools. One connected toolkit.</h2>
            <p className="section-lead">
              Each module solves a distinct problem, but they're designed to inform each other
              instead of operating in isolation.
            </p>
            <p style={{ color: "var(--nl-muted)", fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              A NOXEL SEO audit surfaces a site's visibility gaps — thin content, missing schema,
              slow Core Web Vitals. NOXEL Forge helps close the authority gap those audits often
              reveal, connecting a site with verified backlink partners instead of leaving link
              building as a manual, cold-outreach grind. NOXEL Nexus sits underneath both, detecting
              a visitor's language and region so the same underlying content and tooling adapt
              automatically — no separate localization project required.
            </p>
            <p style={{ color: "var(--nl-muted)", fontSize: 16, lineHeight: 1.7 }}>
              The result isn't three disconnected tools that happen to share a login. It's a single
              account where an issue flagged in one module has a natural next step in another,
              instead of exporting a report and starting over somewhere else.
            </p>
          </div>
        </section>
`;

const HOW_IT_WORKS_END_ANCHOR = `Nexus quietly adapts language and region across every module, so the experience stays consistent no matter which tool you're in.
                </p>
              </div>
            </div>
          </div>
        </section>
`;

if (content.includes(HOW_IT_WORKS_END_ANCHOR)) {
  content = content.replace(HOW_IT_WORKS_END_ANCHOR, HOW_IT_WORKS_END_ANCHOR + CONNECT_SECTION);
} else {
  console.log("⚠ Ancre 'How It Works' introuvable — section 'How the Modules Connect' NON ajoutée. Vérifie manuellement.");
}

// ---------------------------------------------------------------------------
// 2. Section FAQ visible — insérée juste avant le CTA final.
// ---------------------------------------------------------------------------
const FAQ_SECTION = `
        <section id="faq">
          <div className="wrap">
            <div className="section-tag">Frequently Asked Questions</div>
            <h2 className="section-title">Common questions</h2>
            <dl style={{ fontSize: 16, lineHeight: 1.7, color: "var(--nl-muted)" }}>
              <dt style={{ fontWeight: 700, color: "var(--nl-text, #eef1f0)", marginBottom: 6 }}>
                Do I need separate accounts for NOXEL SEO, NOXEL Forge, and Nexus?
              </dt>
              <dd style={{ margin: "0 0 20px" }}>
                No. All three connect to one shared NOXEL360 account, so you sign in once and move
                between modules without separate logins or billing relationships.
              </dd>

              <dt style={{ fontWeight: 700, color: "var(--nl-text, #eef1f0)", marginBottom: 6 }}>
                Is NOXEL SEO free to start?
              </dt>
              <dd style={{ margin: "0 0 20px" }}>
                Yes. NOXEL SEO is free to start, with paid tiers unlocking the AI Copilot, unlimited
                scans, PDF reports, and advanced intelligence modules.
              </dd>

              <dt style={{ fontWeight: 700, color: "var(--nl-text, #eef1f0)", marginBottom: 6 }}>
                What does NOXEL Forge actually do?
              </dt>
              <dd style={{ margin: "0 0 20px" }}>
                NOXEL Forge is a verified backlink exchange network. Members submit real sites in
                exchange for reviewed backlinks, and every submission is screened by an AI reviewer
                against spam and thin content before approval.
              </dd>

              <dt style={{ fontWeight: 700, color: "var(--nl-text, #eef1f0)", marginBottom: 6 }}>
                What is NOXEL Nexus?
              </dt>
              <dd style={{ margin: "0 0 20px" }}>
                NOXEL Nexus is the language, region, and cultural intelligence engine underneath the
                ecosystem. It detects a visitor's language and region to adapt content automatically
                across NOXEL360's products.
              </dd>

              <dt style={{ fontWeight: 700, color: "var(--nl-text, #eef1f0)", marginBottom: 6 }}>
                Can I use just one module instead of the whole suite?
              </dt>
              <dd style={{ margin: "0 0 20px" }}>
                Yes. Each module stands on its own and can be enabled individually — you're not
                required to activate every module to use NOXEL360.
              </dd>

              <dt style={{ fontWeight: 700, color: "var(--nl-text, #eef1f0)", marginBottom: 6 }}>
                How long does it take to see results?
              </dt>
              <dd style={{ margin: "0 0 20px" }}>
                NOXEL SEO's free audit returns results in seconds — you'll see your visibility score
                and top issues immediately. NOXEL Forge backlink placements and ranking improvements
                from fixed technical issues typically show measurable movement within 4–8 weeks,
                consistent with normal search engine re-crawling and re-indexing timelines.
              </dd>

              <dt style={{ fontWeight: 700, color: "var(--nl-text, #eef1f0)", marginBottom: 6 }}>
                Is my data shared between modules?
              </dt>
              <dd style={{ margin: 0 }}>
                Only what's needed to make the modules useful together — for example, a site you've
                added to NOXEL SEO is available to reference in NOXEL Forge without re-entering it.
                NOXEL360 doesn't sell or share account data with third parties.
              </dd>
            </dl>
          </div>
        </section>
`;

const FINAL_CTA_ANCHOR = `        <div className="final-cta">`;

if (content.includes(FINAL_CTA_ANCHOR)) {
  content = content.replace(FINAL_CTA_ANCHOR, FAQ_SECTION + "\n" + FINAL_CTA_ANCHOR);
} else {
  console.log("⚠ Ancre 'final-cta' introuvable — section FAQ NON ajoutée. Vérifie manuellement.");
}

// ---------------------------------------------------------------------------
if (content === original) {
  console.log("ℹ Aucun changement appliqué — vérifie les ancres manuellement.");
  process.exit(0);
}

console.log(`${DRY_RUN ? "[DRY RUN] Modifierait" : "Modifié"} : frontend/src/pages/LandingPage.tsx`);
console.log(`Ajout net : ~${(content.length - original.length)} caractères (~${Math.round((content.length - original.length) / 5.5)} mots)`);

if (!DRY_RUN) {
  writeFileSync(PATH + ".bak", original, "utf8");
  writeFileSync(PATH, content, "utf8");
  console.log("\nPense à ajouter le même contenu au fallback statique dans frontend/index.html");
  console.log("si tu veux que les crawlers qui n'exécutent pas JS le voient aussi.");
}
