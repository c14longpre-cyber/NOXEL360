# NOXEL360 — Assistants Claude Code

Plateforme modulaire NOXEL (noxel360.com). Ce fichier définit les 3 assistants spécialisés qui testent, relisent et rédigent pour le dépôt.

## Structure du projet

```
noxel360/
├── backend/            Node.js + Express + TypeScript sur Railway (noxel360-production-aa57.up.railway.app)
│   └── src/
│       ├── server.ts   Point d'entrée (CORS credentials: true) ; /api/seo/* redirige vers noxelseo.com
│       ├── auth/       Contrôleur, sessions, cookies + providers/ (Google, Apple, Microsoft, GitHub, Facebook, LinkedIn, TikTok)
│       ├── db/         pool.ts : Postgres (DATABASE_URL), schéma créé au démarrage
│       └── utils/      http.ts (HttpError, asyncRoute, errorHandler)
├── frontend/           React 18 + Vite + TypeScript + Tailwind 4 sur Vercel (noxel360.com)
│   ├── src/
│   │   ├── App.tsx, pages/, app/ (host, modules, pages), nexus/
│   │   ├── app/modules/useModulesIndex.ts   SOURCE DE VÉRITÉ des modules affichés
│   │   ├── auth/       AuthStore, NoxelAccessModal, OAuthCallbackPage
│   │   ├── i18n/       languageCatalog.ts (230+ langues), locales/*.ts, translate.ts
│   │   └── language/   LanguageStore.tsx (RTL auto)
│   ├── public/learn/   Pages éducatives statiques (~150 fichiers + dossiers de langue)
│   ├── public/pricing/ Page d'offre déployée (noxel360.com/pricing) : modules live + teaser Spectra, sans prix
│   └── scripts/        validate-locales.cjs, auto-detect-translated-languages.cjs, CSV d'inventaire i18n
├── noxel-library/      Sous-projet bibliothèque
└── vercel.json         Build frontend + rewrite /api/* → Railway + catch-all SPA
```

## Modules (`frontend/src/app/modules/useModulesIndex.ts`)

NOXEL360 ne compte que quatre modules :

| Clé | Nom | Destination | Statut |
|-----|-----|-------------|--------|
| seo | NOXEL SEO | https://noxelseo.com (produit externe) | ready |
| forge | NOXEL FORGE | https://noxelforge.com (produit externe) | ready |
| nexus | NOXEL NEXUS | `/nexus` (seul module interne) | core |
| spectra | NOXEL SPECTRA | https://noxelspectra.com | « coming soon » |

Prix : chaque module garde ses prix et paliers sur son propre site (noxelseo.com, noxelforge.com). NOXEL360 n'affiche aucun prix ; Nexus est inclus avec le compte, Spectra sera annoncé au lancement.

**Modules abandonnés** : Core, MAESTRO, ATLAS, LINKS, SERP, VITALS, OPTIMA (webp), FLOW, MORPH, ainsi qu'Analytics, CRM et Social. Ce sont des idées écartées en cours de route. Ne pas les réintroduire, ni dans le code, ni dans les textes, ni dans les dictionnaires, sans demande explicite de l'utilisateur. Leurs traces restantes (`frontend/src/modules/nexus/*.md`, champ `morphProfile` du compte) sont connues et volontairement laissées en place pour l'instant.

## Règles critiques

1. **Modules et prix** : seuls SEO, Forge, Nexus et Spectra existent. Le dashboard, la navigation et la page `frontend/public/pricing/` ne doivent mentionner qu'eux. Ne jamais inventer un prix : les prix vivent sur le site de chaque module.
2. **Fichiers .js compilés à côté des .ts** (frontend/src, i18n/locales) : modifier le `.ts` seulement, puis vérifier qu'un `.js` périmé ne masque pas le changement à l'import. Ne jamais éditer uniquement le `.js`.
3. **i18n** : `FULLY_TRANSLATED_CODES` (languageCatalog.ts) liste les langues complètes (26 aujourd'hui). Ajouter une langue = `locales/XX.ts` + entrée dans `translate.ts` + code dans `FULLY_TRANSLATED_CODES`. Clés identiques à `en.ts`.
4. **Langues autochtones** : jamais de traduction automatique publiée. Seuls des locuteurs natifs ou traducteurs approuvés par la communauté (voir CONTRIBUTING_LANGUAGES.md).
5. **Couleurs officielles** : vert #3ddc84, violet #A855F7. L'ancien vert #3cde6a (et `rgba(60,222,106,…)`) a été remplacé partout ; il ne doit pas revenir.
6. **vercel.json** : le rewrite `/api/:path*` doit précéder le catch-all SPA `/((?!api/).*)`.
7. **Contrat API** : réponses `{ ok: boolean, ... , error?: string }`. Codes 400 / 401 / 403 / 500 cohérents.
8. **CORS** : géré uniquement par `server.ts` (liste blanche `allowedOrigins` + `credentials: true`). Ne jamais ajouter d'en-tête `Access-Control-Allow-Origin` dans `vercel.json` : un `*` est incompatible avec les cookies de session.
9. **Routes actives** : seules les routes montées dans `server.ts` existent en production : `/health`, `/api/health` et `/api/auth/*`. `/api/seo/*` n'est qu'une redirection 301 vers https://noxelseo.com : NOXEL360 n'a plus de moteur SEO interne, ne pas en recréer un. Un fichier de route non monté est du code mort : ne pas le présenter comme fonctionnel.
10. **Comptes et sessions** : stockés dans Postgres (`backend/src/db/pool.ts`, `DATABASE_URL`). En production, `DATABASE_URL` doit toujours être définie : sans elle, tout est perdu au redémarrage. Ne jamais renvoyer au navigateur les jetons OAuth (`accessToken`, `refreshToken`) ni le profil brut : `listConnectedProviders` les met à null.

## Assistants

Chaque assistant est une skill dans `.claude/skills/` et s'invoque par `/nom` (ordinateur ou téléphone).

### 🧪 `/testeur-360` — Tests et validation
Lecture du code, build, type-check, appels API locaux. Aucun déploiement, aucun commit.
Vérifie : build frontend/backend, API backend, auth OAuth, cohérence des modules, i18n, routes, vercel.json.

### 🔍 `/relecteur-360` — Revue de code et corrections
Lecture et écriture. Corrige les erreurs de type, imports, contrats API, mentions de modules abandonnés, couleurs. Commit seulement avec l'approbation de l'utilisateur.

### ✍️ `/redacteur-360` — Rédaction et localisation
Textes UI français/anglais, pages `learn/`, page de prix `public/pricing/`, dictionnaires `locales/*.ts`, voix de marque NOXEL.

## Commandes utiles

```bash
npm run install:all          # Installe racine + frontend + backend
npm run backend:dev          # Backend → http://localhost:4000
npm run dev                  # Frontend → http://localhost:5173
npm run build                # tsc && vite build (frontend)
npm --prefix backend run build   # tsc backend
(cd frontend && node scripts/validate-locales.cjs)   # Contrôle des dictionnaires (à lancer depuis frontend/)
```

## Workflow Git

- Les assistants travaillent sur une branche, jamais directement sur `main`.
- L'utilisateur relit les commits avant la mise en production.
- Déploiement : push sur GitHub → Vercel (frontend) et Railway (backend) se déploient automatiquement.

## Consentement cookies — NOXEL Consent 1.4.0 (commun aux sites NOXEL)

- **Fichiers** : `frontend/public/consent/` (`noxel-consent.js`, `noxel-consent.css`, `sites.js`), chargés dans le `<head>` AVANT tout outil facultatif. Le même moteur est copié à l'identique dans noxel360, noxelseo, noxelforge et noxelspectra : toute modification se fait partout, version incrémentée dans l'en-tête du fichier.
- **Tout traceur passe par le kit** : script facultatif écrit `<script type="text/plain" data-consent="analytics|marketing|preferences" data-src="…">`, SDK démarré par `NoxelConsent.register()` ou rendu seulement si `NoxelConsent.has(catégorie)` (hook `src/components/consent/useNoxelConsent.ts`). Jamais de GTM, gtag, pixel, `<noscript>` de suivi ou widget tiers actif en direct. Déclarer l'outil dans `providers` et, pour un composant React, sa catégorie dans `enabledCategories`.
- **Mémoire entre les sites** : le choix voyage dans les liens vers les autres sites NOXEL (`#nxc=…`, sans identifiant, accepté seulement si la page d'origine est un site NOXEL). Donc **pas de `noreferrer`** sur un lien vers noxel360.com, noxelseo.com, noxelforge.com ou noxelspectra.com (`rel="noopener"` suffit) ; pour `window.open`, passer l'adresse par `NoxelConsent.relayUrl(url)`.
- **Politique** : `privacyUrl` vide pour noxelforge.com et noxelspectra.com tant qu'aucune politique n'est publiée. Changer d'outil ou de finalité = incrémenter `policyVersion` du site dans `sites.js`.
- **Look** (1.2.0) : charte NOXEL (fond #1a1a1a, textes #f5f5f5/#888, vert #3ddc84, violet #A855F7) et boutons HUD (dessins `cancel`, `ok`, `apply-filters`, `save-recipe`, `remove-image`, `protect` copiés tels quels de hud-data.ts du kit HUD de Spectra, intégrés au moteur).
- **Ouverture à l'arrivée** (1.4.0, `openOnArrival: true` dans `sites.js`) : la même fenêtre de préférences s'ouvre sur tous les sites NOXEL tant qu'aucun choix n'existe. Catégories et outils du réseau définis une seule fois dans `NOXEL_CONSENT_NETWORK` (`sites.js`) — ne pas redéclarer de `providers` dans les pages. « Fermer sans modifier » (ou Échap) = continuer sans accepter. Interface en `translate="no"` (déjà fr/en).
- Le kit (README, tests `core`, `relay`, `consent`) et le plan d'exécution sont la référence ; le kit ne gère que fr/en.
