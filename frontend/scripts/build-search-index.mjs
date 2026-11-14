// Écrit public/search-index.json : l'index de la recherche de la barre du haut (NOXEL Shell 1.3, nx-search.js).
// Pages de l'app (fr/en) + guides Learn en anglais, et leur version française quand elle existe.
// Relancer après l'ajout ou le retrait d'une page Learn ; npm test échoue tant que l'index est périmé.
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = join(ROOT, "public");
const OUT = join(PUB, "search-index.json");

const APP = [
  { t: { fr: "Tableau de bord", en: "Dashboard" }, d: { fr: "Vos modules NOXEL au même endroit", en: "Your NOXEL modules in one place" }, u: "/dashboard" },
  { t: "NOXEL NEXUS", d: { fr: "Langues, pays et régions", en: "Languages, countries and regions" }, u: "/nexus" },
  { t: "Learn", d: { fr: "Tous les guides NOXEL360", en: "All NOXEL360 guides" }, u: "/learn/" },
  { t: { fr: "Forfaits", en: "Pricing" }, d: { fr: "Les modules et leurs sites", en: "The modules and their sites" }, u: "/pricing/" },
  { t: { fr: "L'équipe NOXEL", en: "The NOXEL team" }, d: { fr: "Alfred, Noxel, Jordan, NX360 et Chroma", en: "Alfred, Noxel, Jordan, NX360 and Chroma" }, u: "/team/" },
  { t: { fr: "Compte", en: "Account" }, u: "/app/account" },
  { t: "NOXEL SEO", d: { fr: "Audit SEO, AEO et GEO", en: "SEO, AEO and GEO audit" }, u: "https://www.noxelseo.com/" },
  { t: "NOXEL FORGE", d: { fr: "Échanges de liens vérifiés", en: "Verified link exchanges" }, u: "https://noxelforge.com/forge" },
  { t: "NOXEL SPECTRA", d: { fr: "Images et vidéo", en: "Images and video" }, u: "https://www.noxelspectra.com/" },
  { t: { fr: "Confidentialité", en: "Privacy" }, u: "/privacy" },
  { t: { fr: "Conditions", en: "Terms" }, u: "/terms" },
].map((e) => ({ k: "app", ...e }));

function meta(file) {
  const html = readFileSync(file, "utf8");
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) return null;
  const title = (html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "").replace(/\s*[—|-]\s*NOXEL360.*$/i, "").trim();
  const d = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? "";
  const canon = html.match(/<link\s+rel="canonical"\s+href="https:\/\/noxel360\.com([^"]*)"/i)?.[1];
  const ent = (s) => s.replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, '"');
  return title && canon ? { t: ent(title), d: ent(d), u: canon } : null;
}

export function buildIndex() {
  const guides = [];
  const learn = join(PUB, "learn");
  for (const f of readdirSync(learn).filter((f) => f.endsWith(".html") && f !== "index.html").sort()) {
    const en = meta(join(learn, f));
    if (!en) continue;
    const frFile = join(learn, "fr", f);
    const fr = existsSync(frFile) ? meta(frFile) : null;
    if (fr) guides.push({ k: "guide", l: "en", ...en }, { k: "guide", l: "fr", ...fr });
    else guides.push({ k: "guide", ...en });
  }
  return JSON.stringify([...APP, ...guides]) + "\n";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(OUT, buildIndex());
  console.log(`search-index.json: ${JSON.parse(readFileSync(OUT, "utf8")).length} entrées`);
}
