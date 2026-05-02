# NOXEL360

Modular intelligence platform. Frontend on Vercel, backend on Railway.

---

## Développement local

```bash
# 1. Installer toutes les dépendances
npm run install:all

# 2. Lancer le backend (port 4000)
npm run backend:dev

# 3. Lancer le frontend (port 5173) — dans un autre terminal
npm run dev
```

Ouvrir http://localhost:5173

---

## Déploiement

### Backend → Railway

```bash
# Variables d'environnement à configurer dans Railway :
PORT=4000
NODE_ENV=production
PAGESPEED_API_KEY=your_key   # optionnel
```

Start command: `npm run start`
Build command: `npm install && npm run build`

### Frontend → Vercel

Le `vercel.json` à la racine configure automatiquement :
- Build: `npm --prefix frontend install && npm --prefix frontend run build`
- Output: `frontend/dist`
- Rewrite `/api/*` → backend Railway

Variables d'environnement Vercel (optionnelles) :
```
VITE_API_URL=/api
```

---

## Architecture SEO

```
Frontend /app/seo  →  SeoModulePage.tsx
  → GET /api/seo/vm/summary?url=https://example.com
  → Vite proxy (dev) ou vercel.json rewrite (prod)
  → Backend Railway  →  seoModuleRouter (seo.module.ts)
  → startRun(url) → scan plugins → WebsiteVM
```

Endpoints actifs :
- `GET /api/seo/health`
- `GET /api/seo/vm/summary?url=...` — lance le scan et retourne les scores
- `GET /api/seo/issues?url=...` — retourne les issues détaillées
- `GET /api/seo/scan/:scanId?url=...` — scan plugin individuel
