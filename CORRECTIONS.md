# NOXEL360 — Corrections + Système i18n à 230+ langues

## TL;DR

1. **Sélecteur de langue temps réel** (dropdown 6 langues + modal + page NEXUS complète)
2. **230+ langues disponibles** au choix : 184 ISO 639-1 + ~60 langues autochtones
3. **Langues autochtones traitées avec respect** : bloc dédié, endonymes natifs, protocoles documentés
4. **Chargement dynamique** : bundle initial léger, chaque dictionnaire arrive à la demande
5. **Bannière de contribution** discrète pour langues non encore traduites
6. 6 langues entièrement traduites aujourd'hui (en, fr, es, de, it, pt) — les autres se remplissent au fur et à mesure

---

## Architecture i18n

### Fichiers clés

```
frontend/src/
├── i18n/
│   ├── data/
│   │   └── iso_639-1.json         ← 184 langues ISO avec endonymes
│   ├── locales/
│   │   ├── en.ts                  ← anglais (toujours chargé)
│   │   ├── fr.ts, es.ts, de.ts,   ← chargés dynamiquement
│   │   │   it.ts, pt.ts
│   │   └── [à venir : XX.ts]      ← contributeurs
│   ├── types.ts                   ← AppLanguage = string (ouvert)
│   ├── languageCatalog.ts         ← REGISTRE CENTRAL 230+ langues
│   └── translate.ts               ← loader dynamique + cache
├── language/
│   └── LanguageStore.tsx          ← Context React, auto-dir RTL
├── components/
│   ├── TranslationStatusBanner.tsx ← bannière "translation in progress"
│   ├── HeaderLanguage.tsx         ← dropdown compact (6 principales)
│   └── LanguageModal.tsx          ← modal complet
├── pages/
│   └── NexusPage.tsx              ← PAGE COMPLÈTE 250 pays + langues
└── useI18n.ts                     ← hook principal
```

### Flow complet quand l'utilisateur change de langue

1. Clic sur "Inuktitut" dans la page NEXUS (ou dans le modal)
2. `setLanguage("iu")` → met à jour le Context
3. `useEffect` déclenche `loadDictionary("iu")` — pas de dictionnaire dédié, fallback anglais
4. `document.documentElement.lang = "iu"` et `dir = "ltr"` (ou "rtl" si applicable)
5. `localStorage.noxel.language = "iu"` — persisté
6. Tous les composants qui consomment `useI18n()` se re-rendent
7. Le badge "langue active" montre **ᐃᓄᒃᑎᑐᑦ** (endonyme)
8. Le `TranslationStatusBanner` apparaît : *"ᐃᓄᒃᑎᑐᑦ — translation in progress. The interface is shown in English while a native-speaker translation is prepared. Contribute a translation →"*
9. L'utilisateur peut fermer la bannière ou cliquer le lien

Quand un·e locuteur·trice natif·ve ajoutera plus tard `locales/iu.ts` et le nommera dans `FULLY_TRANSLATED_CODES`, la bannière disparaîtra automatiquement et l'UI passera en Inuktitut sans autre changement.

---

## Respect des langues autochtones

### Conception

- **Section dédiée** dans la page NEXUS (pas une sous-catégorie)
- **Endonymes en écriture originale** partout : ᐃᓄᒃᑎᑐᑦ, Diné bizaad, Te Reo Māori, ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ, Runa Simi
- **Nation associée** affichée en sous-titre ("Inuit", "Navajo Nation", "Cree", etc.)
- **Badge ★ violet** sur les pays avec langues autochtones dans la liste
- **Fallback silencieux mais indiqué** : badge ⟳ discret quand l'UI n'est pas encore traduite

### Langues autochtones incluses (~60)

**Amérique du Nord** : Inuktitut (iu, ike), Inuinnaqtun (ikt), Cree (cr), Ojibwe (oj), Mohawk (moh), Mi'kmaq (mic), Dene Suliné (ath), Blackfoot (bla), Michif (crg), Navajo (nv), Cherokee (chr), Lakota (lkt), Dakota (dak), Cheyenne (chy), Hawaiian (haw), Central Yup'ik (ypk)

**Amérique latine** : Nahuatl, Yucatec Maya, K'iche', Mam, Quechua, Aymara, Guaraní, Mapudungun, Nheengatu

**Océanie** : Māori, Samoan, Tongan, Fijian, Tahitian, Palauan, Gilbertese, Marshallese

**Europe** : 5 variantes Sámi (Northern, Lule, Southern, Skolt, Inari), Breton, Corsican, Occitan, Cornish, Manx, Frisian, Luxembourgish, Romansh, Friulian, Sardinian, Sicilian, Venetian

**Asie** : Tibetan, Uyghur, Mongolian, Kurdish (central et northern), Santali, Kashmiri

**Afrique** : Amharic, Oromo, Tigrinya, Somali, Hausa, Igbo, Yoruba, isiZulu, isiXhosa, Sesotho, Setswana, Xitsonga, Tshivenḓa, Swahili, Kinyarwanda, Lingala, Wolof, Tamazight

### Protocoles de contribution

Voir **`CONTRIBUTING_LANGUAGES.md`** à la racine. Points clés :
- Seul·e·s les locuteur·trice·s natif·ve·s ou traducteur·trice·s approuvé·e·s par la communauté contribuent aux langues autochtones
- Pas de Google Translate / DeepL pour ces langues (souvent erroné, parfois offensant)
- Orthographe et écriture préférées par la communauté (syllabique, latine, etc.)
- Attribution visible dans `ATTRIBUTIONS.md`
- Variantes dialectales supportées (`iu-CA-NU` par exemple)

---

## Ajouter une nouvelle langue (procédure courte)

```powershell
# 1. Créer le fichier
cd C:\Dev\NOXEL360\frontend\src\i18n\locales
Copy-Item en.ts ja.ts

# 2. Traduire les valeurs dans ja.ts (garder les clés)

# 3. Enregistrer le loader dans translate.ts :
#    ja: () => import("./locales/ja").then((m) => m.ja),

# 4. Marquer la langue comme complète dans languageCatalog.ts :
#    FULLY_TRANSLATED_CODES.add("ja")  -- ou ajouter au Set initial
```

C'est tout. Vite recharge, la bannière disparaît pour cette langue, le badge ⟳ aussi.

---

## Bugs corrigés au passage

- **Duplicata `LanguageContext.tsx`** — supprimé
- **`countryData.ts` vide** — reconstruit à partir des 250 pays de `countryLanguages.json`
- **Dépendances manquantes** (`world-countries`, `currency-symbol-map`) — remplacées par table locale `countryMetaData.ts`
- **Type `AppLanguage` trop restrictif** (30 codes) — ouvert à `string` pour supporter 230+ langues
- **Chaînes en dur dans DashboardHome, AppShell, ModuleLandingPage, LanguageModal** — remplacées par `t("...")`

---

## Langues entièrement traduites à ce jour

| Code | Nom natif | Statut |
|---|---|---|
| en | English | ✅ Complet (source) |
| fr | Français | ✅ Complet |
| es | Español | ✅ Complet |
| de | Deutsch | ✅ Complet |
| it | Italiano | ✅ Complet |
| pt | Português | ✅ Complet |
| *224 autres* | *(endonymes natifs)* | 🔄 Fallback anglais + bannière |

---

## Lancer le projet

```powershell
cd C:\Dev\NOXEL360\frontend
npm install
npm run dev
```

Ouvrir `http://localhost:5173`, cliquer la carte **NOXEL NEXUS** du dashboard, ou aller directement sur `http://localhost:5173/nexus`.

Tester : sélectionnez **Canada** dans la liste → vous voyez English, Français dans "Official", puis ᐃᓄᒃᑎᑐᑦ (Inuktitut), Anishinaabemowin (Ojibwe), Kanien'kéha (Mohawk), Nēhiyawēwin (Cree), Lnuismk (Mi'kmaq) dans "Indigenous languages". Cliquez n'importe laquelle — la langue active change immédiatement, avec bannière de contribution si l'UI n'est pas encore traduite.

---

## À faire plus tard (non bloquant)

- Traduire l'UI dans les ~30 langues majeures restantes (ja, zh, ar, ru, hi, ko, tr, nl, sv, no, da, fi, pl, cs, hu, ro, el, uk, id, th, vi, ms, bn, he, fa, ta, te, ml, etc.) — je peux le faire dans de futurs tours
- Enrichir `INDIGENOUS_SEEDS` avec 40+ autres nations (Aymara détaillée, Guarani détaillée, Adivasi, aborigènes d'Australie distincts, etc.)
- Créer un fichier `ATTRIBUTIONS.md` pour les futures contributions de locuteurs natifs
- Traduire `Sidebar.tsx`, `Topbar.tsx`, `AccountPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`

---

## Note sur les `node_modules`

Supprimés de l'archive (~346 Mo). Relancez `npm install` dans `frontend/` (et dans `backend/`, `noxel-library/` si vous les utilisez).
