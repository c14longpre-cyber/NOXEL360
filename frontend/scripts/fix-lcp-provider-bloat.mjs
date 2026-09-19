#!/usr/bin/env node
// scripts/fix-lcp-provider-bloat.mjs
//
// Corrige le LCP/JS-inutilisé identifiés dans le rapport NOXEL SEO sur
// noxel360.com :
//   1. Retire GoogleOAuthProvider de main.tsx — aucun composant n'utilise
//      ses hooks (useGoogleLogin/<GoogleLogin>), seule googleLogout() est
//      utilisée et elle n'a pas besoin du provider. Élimine ~101 Ko / 121ms
//      du chargement initial pour TOUS les visiteurs, y compris la page
//      d'accueil publique.
//   2. Déplace AccountProvider de main.tsx (global) vers App.tsx, pour
//      qu'il n'enveloppe que la route /app/account — le seul endroit qui
//      l'utilise réellement (AccountPage.tsx via useAccountStore).
//
// Idempotent-safe : crée un .bak de chaque fichier avant modification.
//
// Usage :
//   node scripts/fix-lcp-provider-bloat.mjs            # applique
//   node scripts/fix-lcp-provider-bloat.mjs --dry-run  # affiche seulement

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");

const MAIN_PATH = join(ROOT, "frontend/src/main.tsx");
const APP_PATH = join(ROOT, "frontend/src/App.tsx");

function apply(path, label, replacements) {
  if (!existsSync(path)) {
    console.log(`⏭ Fichier introuvable, sauté : ${label}`);
    return;
  }
  const original = readFileSync(path, "utf8");
  let content = original;
  let changes = 0;

  for (const [pattern, replacement, description] of replacements) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      changes++;
    } else {
      console.log(`⚠ Motif non trouvé dans ${label} : ${description} — vérifie manuellement.`);
    }
  }

  if (content === original) {
    console.log(`ℹ Aucun changement appliqué : ${label}`);
    return;
  }

  console.log(`${DRY_RUN ? "[DRY RUN] Modifierait" : "Modifié"} : ${label} (${changes}/${replacements.length} remplacement(s) réussis)`);

  if (!DRY_RUN) {
    writeFileSync(path + ".bak", original, "utf8");
    writeFileSync(path, content, "utf8");
  }
}

// ---------------------------------------------------------------------------
// 1. main.tsx — retirer GoogleOAuthProvider, retirer AccountProvider
// ---------------------------------------------------------------------------
apply(MAIN_PATH, "frontend/src/main.tsx", [
  [
    /import \{ GoogleOAuthProvider \} from "@react-oauth\/google";\n/,
    "",
    "import GoogleOAuthProvider",
  ],
  [
    /import \{ AccountProvider \} from "\.\/account\/AccountStore";\n/,
    "",
    "import AccountProvider",
  ],
  [
    /const googleClientId = import\.meta\.env\.VITE_GOOGLE_CLIENT_ID \|\| "";\n\n?/,
    "",
    "googleClientId constant",
  ],
  [
    /<GoogleOAuthProvider clientId=\{googleClientId\}>\n?/,
    "",
    "opening <GoogleOAuthProvider>",
  ],
  [
    /(\s*)<\/GoogleOAuthProvider>\n?/,
    "",
    "closing </GoogleOAuthProvider>",
  ],
  [
    /<AccountProvider>\n?/,
    "",
    "opening <AccountProvider>",
  ],
  [
    /(\s*)<\/AccountProvider>\n?/,
    "",
    "closing </AccountProvider>",
  ],
]);

// ---------------------------------------------------------------------------
// 2. App.tsx — importer AccountProvider, l'appliquer uniquement à la route
//    /app/account
// ---------------------------------------------------------------------------
apply(APP_PATH, "frontend/src/App.tsx", [
  [
    /import \{ useAuthStore \} from "\.\/auth\/AuthStore";\n/,
    'import { useAuthStore } from "./auth/AuthStore";\nimport { AccountProvider } from "./account/AccountStore";\n',
    "add AccountProvider import",
  ],
  [
    /<Route path="account" element=\{<AccountPage \/>\} \/>/,
    '<Route path="account" element={<AccountProvider><AccountPage /></AccountProvider>} />',
    "wrap AccountPage route with AccountProvider",
  ],
]);

console.log(`\n${DRY_RUN ? "[DRY RUN] Terminé." : "Terminé."} Vérifie le rendu (npm run dev / npm run build) avant de commit.`);
