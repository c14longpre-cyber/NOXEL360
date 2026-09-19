#!/usr/bin/env node
// scripts/update-360-logo-refs.mjs
//
// Remplace toutes les références au logo NOXEL360 par le nouveau
// NOXEL_360_LOGO.svg (servi statiquement depuis /public/logos/),
// et corrige au passage le placeholder "const forge = noxel360" dans
// logos.ts/.js pour pointer vers le vrai NOXEL_FORGE_LOGO.svg.
//
// Idempotent : relancer le script ne duplique rien, il applique les
// mêmes remplacements sur l'état déjà corrigé sans erreur.
//
// Usage :
//   node scripts/update-360-logo-refs.mjs            # applique
//   node scripts/update-360-logo-refs.mjs --dry-run   # affiche seulement

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");

const NEW_360_PATH = "/logos/NOXEL_360_LOGO.svg";
const NEW_FORGE_PATH = "/logos/NOXEL_FORGE_LOGO.svg"; // ajuste si tu l'as mis ailleurs

const FILES = [
  {
    path: "frontend/src/app/host/AppShell.tsx",
    replacements: [
      [/import\s+noxel360Logo\s+from\s+["']@\/assets\/logos\/webp\/noxel-360\.avif["'];?\n?/, ""],
      [/src=\{noxel360Logo\}/g, `src="${NEW_360_PATH}"`],
    ],
  },
  {
    path: "frontend/src/components/Topbar.tsx",
    replacements: [
      [/import\s+noxel360Logo\s+from\s+["']@\/assets\/logos\/webp\/noxel-360\.avif["'];?\n?/, ""],
      [/src=\{noxel360Logo\}/g, `src="${NEW_360_PATH}"`],
    ],
  },
  {
    path: "frontend/src/app/pages/AccountPage.tsx",
    replacements: [
      [/src=["']\/logos\/noxel360\.svg["']/g, `src="${NEW_360_PATH}"`],
    ],
  },
  {
    path: "frontend/src/app/modules/logos.ts",
    replacements: [
      [/import\s+noxel360\s+from\s+["']@\/assets\/logos\/webp\/noxel-360\.avif["'];?\n?/, ""],
      [/const\s+forge\s*=\s*noxel360;?\n?/, `const forge = "${NEW_FORGE_PATH}";\n`],
      [/"360":\s*noxel360,/, `"360": "${NEW_360_PATH}",`],
    ],
  },
  {
    path: "frontend/src/app/modules/logos.js",
    replacements: [
      [/import\s+noxel360\s+from\s+["']@\/assets\/logos\/webp\/noxel-360\.avif["'];?\n?/, ""],
      [/const\s+forge\s*=\s*noxel360;?\n?/, `const forge = "${NEW_FORGE_PATH}";\n`],
      [/"360":\s*noxel360,/, `"360": "${NEW_360_PATH}",`],
    ],
  },
];

let totalChanges = 0;

for (const file of FILES) {
  const fullPath = join(ROOT, file.path);
  if (!existsSync(fullPath)) {
    console.log(`⏭ Fichier introuvable, sauté : ${file.path}`);
    continue;
  }

  let content = readFileSync(fullPath, "utf8");
  const original = content;
  let fileChanges = 0;

  for (const [pattern, replacement] of file.replacements) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) fileChanges++;
  }

  if (content === original) {
    console.log(`ℹ Aucun changement nécessaire : ${file.path}`);
    continue;
  }

  console.log(`${DRY_RUN ? "[DRY RUN] Modifierait" : "Modifié"} : ${file.path} (${fileChanges} remplacement(s))`);
  totalChanges += fileChanges;

  if (!DRY_RUN) {
    writeFileSync(fullPath + ".bak", original, "utf8");
    writeFileSync(fullPath, content, "utf8");
  }
}

console.log(`\n${DRY_RUN ? "[DRY RUN] Total" : "Total"} : ${totalChanges} remplacement(s) sur ${FILES.length} fichiers vérifiés.`);
if (!DRY_RUN && totalChanges > 0) {
  console.log("Des .bak ont été créés à côté de chaque fichier modifié.");
}
