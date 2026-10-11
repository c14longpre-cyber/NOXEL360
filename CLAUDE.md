# NOXEL360 — Assistants Claude Code

Plateforme modulaire NOXEL (noxel360.com). Ce fichier définit les 3 assistants spécialisés qui testent, relisent et rédigent pour le dépôt.

## Structure du projet

```
noxel360/
├── backend/            Node.js + Express + TypeScript sur Railway (noxel360-production-aa57.up.railway.app)
│   └── src/
│       ├── server.ts   Point d'entrée (CORS credentials: true)
│       ├── routes/     account, ads, assistant, market, performance, scripts, seo, training
│       ├── seo/        Module SEO : scans/ (architecture, backlinks, lighthouse, perf, structured-data), runs, issues, viewmodels
│       ├── auth/       Contrôleur, sessions, cookies + providers/ (Google, Apple, Microsoft, GitHub, Facebook, LinkedIn, TikTok)
│       └── services/   pagespeedService, analyzePerformance, userStore, session
├── frontend/           React 18 + Vite + TypeScript + Tailwind 4 sur Vercel (noxel360.com)
│   ├── src/
│   │   ├── App.tsx, pages/, app/ (host, modules, pages), nexus/
│   │   ├── app/modules/useModulesIndex.ts   SOURCE DE VÉRITÉ des modules affichés
│   │   ├── auth/       AuthStore, NoxelAccessModal, OAuthCallbackPage
│   │   ├── i18n/       languageCatalog.ts (230+ langues), locales/*.ts, translate.ts
│   │   └── language/   LanguageStore.tsx (RTL auto)
│   ├── public/learn/   Pages éducatives statiques (~150 fichiers + dossiers de langue)
│   ├── public/pricing/ Page de prix déployée (noxel360.com/pricing) + tiers/
│   └── scripts/        validate-locales.cjs, auto-detect-translated-languages.cjs, CSV d'inventaire i18n
├── landing/            HÉRITÉ, non déployé : ancien site de prix des modules abandonnés
├── noxel-library/      Sous-projet bibliothèque
├── module-pricing.json HÉRITÉ : 10 anciens modules, ne fait plus foi
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

Paliers : Bronze / Silver / Gold / Platinum / Diamond.

**Modules abandonnés** : Core, MAESTRO, ATLAS, LINKS, SERP, VITALS, OPTIMA (webp), FLOW, MORPH, ainsi qu'Analytics, CRM et Social. Ce sont des idées écartées en cours de route. Ne pas les réintroduire, ni dans le code, ni dans les textes, ni dans les dictionnaires, sans demande explicite de l'utilisateur. Leurs traces restantes (`landing/`, `module-pricing.json`, `frontend/src/modules/nexus/*.md`, champ `morphProfile` du compte) sont connues et volontairement laissées en place pour l'instant.

## Règles critiques

1. **Modules et prix** : seuls SEO, Forge, Nexus et Spectra existent. Le dashboard, la navigation et la page `frontend/public/pricing/` ne doivent mentionner qu'eux. Ne jamais inventer un prix : `module-pricing.json` et `landing/` ne sont plus des références.
2. **Fichiers .js compilés à côté des .ts** (frontend/src, i18n/locales) : modifier le `.ts` seulement, puis vérifier qu'un `.js` périmé ne masque pas le changement à l'import. Ne jamais éditer uniquement le `.js`.
3. **i18n** : `FULLY_TRANSLATED_CODES` (languageCatalog.ts) liste les langues complètes (26 aujourd'hui). Ajouter une langue = `locales/XX.ts` + entrée dans `translate.ts` + code dans `FULLY_TRANSLATED_CODES`. Clés identiques à `en.ts`.
4. **Langues autochtones** : jamais de traduction automatique publiée. Seuls des locuteurs natifs ou traducteurs approuvés par la communauté (voir CONTRIBUTING_LANGUAGES.md).
5. **Couleurs officielles** : vert #3ddc84, violet #A855F7. L'ancien vert #3cde6a (et `rgba(60,222,106,…)`) a été remplacé partout ; il ne doit pas revenir.
6. **vercel.json** : le rewrite `/api/:path*` doit précéder le catch-all SPA `/((?!api/).*)`.
7. **Contrat API** : réponses `{ ok: boolean, ... , error?: string }`. Codes 400 / 401 / 403 / 500 cohérents.
8. **CORS** : géré uniquement par `server.ts` (liste blanche `allowedOrigins` + `credentials: true`). Ne jamais ajouter d'en-tête `Access-Control-Allow-Origin` dans `vercel.json` : un `*` est incompatible avec les cookies de session.
9. **Placeholders** : `routes/assistant.routes.ts` renvoie des données démo (`demo-assistant-1`). Ne pas les présenter comme fonctionnels.

## Assistants

Chaque assistant est une skill dans `.claude/skills/` et s'invoque par `/nom` (ordinateur ou téléphone).

### 🧪 `/testeur-360` — Tests et validation
Lecture du code, build, type-check, appels API locaux. Aucun déploiement, aucun commit.
Vérifie : build frontend/backend, scans SEO, auth OAuth, cohérence des modules, i18n, routes, vercel.json.

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
