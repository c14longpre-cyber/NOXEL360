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
DATABASE_URL=${{Postgres.DATABASE_URL}}   # référence au service Postgres Railway
```

Base de données : un service **Postgres** Railway, relié au backend par `DATABASE_URL`.
Les tables (users, user_identities, sessions, auth_tickets) sont créées automatiquement
au démarrage. Sans `DATABASE_URL`, le backend stocke comptes et sessions en mémoire
(perdus à chaque redémarrage) : réservé au développement local.
`PGSSL=true` seulement si la connexion passe par le proxy public de Railway.

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

## NOXEL SEO

NOXEL SEO est un produit externe : https://noxelseo.com. NOXEL360 n'a plus de moteur SEO interne ;
toute requête vers `/api/seo/*` est redirigée (301) vers noxelseo.com.

Endpoints actifs du backend :
- `GET /health`, `GET /api/health`
- `/api/auth/*` (OAuth : démarrage, callback, session, déconnexion)
