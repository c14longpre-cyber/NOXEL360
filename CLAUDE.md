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
│   │   ├── App.tsx, pages/, app/ (host, modules, pages), nexus/, modules/
│   │   ├── auth/       AuthStore, NoxelAccessModal, OAuthCallbackPage
│   │   ├── i18n/       languageCatalog.ts (230+ langues), locales/*.ts, translate.ts
│   │   └── language/   LanguageStore.tsx (RTL auto)
│   ├── public/learn/   Pages éducatives statiques (~150 fichiers + dossiers de langue)
│   └── scripts/        validate-locales.cjs, auto-detect-translated-languages.cjs, CSV d'inventaire i18n
├── landing/            Landing statique + pricing/<module>/ + tiers/
├── noxel-library/      Sous-projet bibliothèque
├── module-pricing.json SOURCE DE VÉRITÉ des modules, prix et paliers
└── vercel.json         Build frontend + rewrite /api/* → Railway + catch-all SPA
```

## Modules (module-pricing.json)

| Id | Nom | Prix réf. | Route |
|----|-----|-----------|-------|
| core | Noxel360 Core | 59 $ | /app |
| MAESTRO | NOXEL MAESTRO | 49 $ | /app/Maestro |
| atlas | NOXEL ATLAS | 99 $ | /app/atlas |
| links | NOXEL LINKS | 79 $ | /app/links |
| seo | NOXEL SEO | 89 $ | /app/seo |
| serp | NOXEL SERP | 59 $ | /app/seo/serp |
| vitals | NOXEL VITALS | 59 $ | /app/seo/vitals |
| webp | NOXEL OPTIMA | 39 $ | /app/webp |
| flow | NOXEL FLOW | 69 $ | /app/flow |
| morph | NOXEL MORPH | 129 $ | /app/morph |

Paliers : Bronze / Silver / Gold / Platinum / Diamond. NOXEL Spectra est affiché « coming soon ».

## Règles critiques

1. **Prix** : `module-pricing.json` fait foi. Le landing (`landing/pricing/*`), le dashboard et le texte marketing doivent en reprendre les chiffres exacts. Toute divergence est un bug.
2. **Fichiers .js compilés à côté des .ts** (frontend/src, i18n/locales) : modifier le `.ts` seulement, puis vérifier qu'un `.js` périmé ne masque pas le changement à l'import. Ne jamais éditer uniquement le `.js`.
3. **i18n** : `FULLY_TRANSLATED_CODES` (languageCatalog.ts) liste les langues complètes (26 aujourd'hui). Ajouter une langue = `locales/XX.ts` + entrée dans `translate.ts` + code dans `FULLY_TRANSLATED_CODES`. Clés identiques à `en.ts`.
4. **Langues autochtones** : jamais de traduction automatique publiée. Seuls des locuteurs natifs ou traducteurs approuvés par la communauté (voir CONTRIBUTING_LANGUAGES.md).
5. **Couleurs officielles** : vert #3ddc84, violet #A855F7. L'ancien vert #3cde6a subsiste dans `frontend/src/styles` et doit être remplacé.
6. **vercel.json** : le rewrite `/api/:path*` doit précéder le catch-all SPA `/((?!api/).*)`.
7. **Contrat API** : réponses `{ ok: boolean, ... , error?: string }`. Codes 400 / 401 / 403 / 500 cohérents.
8. **CORS** : `server.ts` utilise `credentials: true` ; vercel.json renvoie `Access-Control-Allow-Origin: *` sur /api. Les deux sont incompatibles pour les cookies : à surveiller.
9. **Placeholders** : `routes/assistant.routes.ts` renvoie des données démo (`demo-assistant-1`). Ne pas les présenter comme fonctionnels.

## Assistants

Chaque assistant est une skill dans `.claude/skills/` et s'invoque par `/nom` (ordinateur ou téléphone).

### 🧪 `/testeur-360` — Tests et validation
Lecture du code, build, type-check, appels API locaux. Aucun déploiement, aucun commit.
Vérifie : build frontend/backend, scans SEO, auth OAuth, cohérence des prix, i18n, routes, vercel.json.

### 🔍 `/relecteur-360` — Revue de code et corrections
Lecture et écriture. Corrige les erreurs de type, imports, contrats API, prix incohérents, couleurs. Commit seulement avec l'approbation de l'utilisateur.

### ✍️ `/redacteur-360` — Rédaction et localisation
Textes UI français/anglais, pages `learn/`, landing et pricing, dictionnaires `locales/*.ts`, voix de marque NOXEL.

## Commandes utiles

```bash
npm run install:all          # Installe racine + frontend + backend
npm run backend:dev          # Backend → http://localhost:4000
npm run dev                  # Frontend → http://localhost:5173
npm run build                # tsc && vite build (frontend)
npm --prefix backend run build   # tsc backend
node frontend/scripts/validate-locales.cjs   # Contrôle des dictionnaires
```

## Workflow Git

- Les assistants travaillent sur une branche, jamais directement sur `main`.
- L'utilisateur relit les commits avant la mise en production.
- Déploiement : push sur GitHub → Vercel (frontend) et Railway (backend) se déploient automatiquement.
