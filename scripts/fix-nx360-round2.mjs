#!/usr/bin/env node
// scripts/fix-nx360-round2.mjs
//
// Applique en une passe :
//   1. DashboardHome.tsx — ajoute le fix de scroll global (manquant, contrairement
//      à LandingPage.tsx) + agrandit l'image NX360 (140 -> 380px, alignSelf fix
//      pour ne plus couper les griffes) + bascule sur la version transparente.
//   2. LandingPage.tsx — corrige le cleanup du useEffect scroll ("" -> "hidden",
//      cohérent avec le comportement attendu ailleurs) + bascule les 2 images
//      NX360 (hero + ecosystem) sur la version transparente + ajoute une classe
//      CSS pour masquer le hero flottant en mobile.
//   3. LandingPage.css — ajoute la règle média mobile si absente.
//
// Usage :
//   node scripts/fix-nx360-round2.mjs            # applique
//   node scripts/fix-nx360-round2.mjs --dry-run   # affiche seulement

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");

function apply(path, label, replacements) {
  const full = join(ROOT, path);
  if (!existsSync(full)) {
    console.log(`⏭ Fichier introuvable, sauté : ${label}`);
    return;
  }
  const original = readFileSync(full, "utf8");
  let content = original;
  let ok = 0;

  for (const [pattern, replacement, description] of replacements) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      ok++;
    } else {
      console.log(`⚠ [${label}] motif non trouvé : ${description}`);
    }
  }

  if (content === original) {
    console.log(`ℹ Aucun changement appliqué : ${label}`);
    return;
  }

  console.log(`${DRY_RUN ? "[DRY RUN] Modifierait" : "Modifié"} : ${label} (${ok}/${replacements.length} remplacement(s))`);

  if (!DRY_RUN) {
    writeFileSync(full + ".bak", original, "utf8");
    writeFileSync(full, content, "utf8");
  }
}

// ---------------------------------------------------------------------------
// 1. DashboardHome.tsx
// ---------------------------------------------------------------------------
apply("frontend/src/app/pages/DashboardHome.tsx", "DashboardHome.tsx", [
  [
    /import \{ useState \} from "react";/,
    'import { useState, useEffect } from "react";',
    "import useState -> useState + useEffect",
  ],
  [
    /(const \[activeKey, setActiveKey\] = useState<string>\("nexus"\);\r?\n)/,
    `$1
  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "hidden"; };
  }, []);
`,
    "insertion du useEffect overflow",
  ],
  [
    /<img[^>]*alt="NX360, your NOXEL360 companion"[^>]*\/>/,
    `<img
                    src="/NX360-transparent.avif"
                    alt="NX360, your NOXEL360 companion"
                    loading="lazy"
                    style={{
                      width: 380,
                      height: "auto",
                      marginLeft: "auto",
                      flexShrink: 0,
                      opacity: 0.95,
                      alignSelf: "flex-start",
                    }}
                  />`,
    "remplacement du bloc image NX360 (dashboard)",
  ],
]);

// ---------------------------------------------------------------------------
// 2. LandingPage.tsx
// ---------------------------------------------------------------------------
apply("frontend/src/pages/LandingPage.tsx", "LandingPage.tsx", [
  [
    /return \(\) => \{ document\.body\.style\.overflow = ""; \};/,
    'return () => { document.body.style.overflow = "hidden"; };',
    "cleanup overflow: '' -> 'hidden'",
  ],
  [
    /<img[^>]*alt="NX360 — the NOXEL360 companion connecting every module"[^>]*\/>/,
    `<img
            src="/NX360-transparent.avif"
            alt="NX360 — the NOXEL360 companion connecting every module"
            className="nl-mascot-float"
            style={{
              position: "absolute",
              right: "5%",
              top: "50%",
              transform: "translateY(-50%)",
              width: 320,
              opacity: 0.9,
              pointerEvents: "none",
            }}
          />`,
    "image NX360 du hero (landing)",
  ],
  [
    /<img[^>]*alt="NX360"[^>]*\/>/,
    `<img
                  src="/NX360-transparent.avif"
                  alt="NX360"
                  style={{ width: 120, marginBottom: 16, opacity: 0.95 }}
                />`,
    "image NX360 de la section 'Why One Ecosystem'",
  ],
]);

// ---------------------------------------------------------------------------
// 3. LandingPage.css
// ---------------------------------------------------------------------------
const cssPath = join(ROOT, "frontend/src/pages/LandingPage.css");
if (existsSync(cssPath)) {
  const originalCss = readFileSync(cssPath, "utf8");
  if (originalCss.includes(".nl-mascot-float")) {
    console.log("ℹ Règle mobile déjà présente dans LandingPage.css — rien ajouté.");
  } else {
    const newCss = originalCss + `
@media (max-width: 900px) {
  .nl-mascot-float {
    display: none;
  }
}
`;
    console.log(`${DRY_RUN ? "[DRY RUN] Ajouterait" : "Ajouté"} : règle média mobile dans LandingPage.css`);
    if (!DRY_RUN) {
      writeFileSync(cssPath + ".bak", originalCss, "utf8");
      writeFileSync(cssPath, newCss, "utf8");
    }
  }
} else {
  console.log("⏭ LandingPage.css introuvable, sauté.");
}

console.log(`\n${DRY_RUN ? "[DRY RUN] Terminé." : "Terminé."} Copie NX360-transparent.avif dans frontend/public/ si ce n'est pas déjà fait, puis rebuild.`);
