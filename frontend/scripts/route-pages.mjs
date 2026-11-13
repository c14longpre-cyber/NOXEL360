/**
 * Pages React servies avec leur propre <head> et leur propre texte de secours.
 *
 * Sans ce fichier, /dashboard et /nexus recevaient index.html (titre, canonique
 * et texte de l'accueil) : un robot qui ne lance pas le JavaScript voyait une
 * copie de l'accueil avec une canonique vers https://noxel360.com/.
 *
 * Après `vite build`, `node scripts/route-pages.mjs` écrit dist/<route>.html à
 * partir de dist/index.html (mêmes scripts et mêmes styles hachés), avec :
 * titre, description, canonique, og:*, twitter:*, fil d'Ariane et contenu de
 * secours propres à la route. vercel.json réécrit /dashboard → /dashboard.html.
 * build-sitemap.mjs lit ROUTE_PAGES pour les lister dans sitemap-core.xml.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://noxel360.com";
const P = 'style="font-size:16px;line-height:1.7;color:rgba(255,255,255,0.75);margin-bottom:16px;"';
const H2 = 'style="font-size:22px;font-weight:800;margin:32px 0 16px;"';
const A = 'style="color:#3ddc84;"';

export const ROUTE_PAGES = [
  {
    route: "dashboard",
    title: "NOXEL360 Dashboard — NOXEL SEO, FORGE, NEXUS & SPECTRA",
    description:
      "The NOXEL360 dashboard links the four NOXEL modules: NOXEL SEO audits, NOXEL FORGE backlinks, NOXEL NEXUS languages and NOXEL SPECTRA image tools.",
    crumb: "Dashboard",
    body: `
        <h1 style="font-size:34px;font-weight:900;line-height:1.2;margin-bottom:20px;">NOXEL360 dashboard: the modular suite to build, audit and evolve your products</h1>
        <p ${P}>The NOXEL360 dashboard is the cockpit of the NOXEL ecosystem. Each module stands alone and keeps its own site, and the dashboard links them under one growth logic: enable only what you need, then add the rest when you are ready.</p>
        <h2 ${H2}>The four NOXEL modules</h2>
        <p ${P}><strong>NOXEL SEO</strong> runs full audits of a website: technical checks, content, Core Web Vitals, structured data and AI search visibility, with a score per category and fixes written in plain language. <a href="https://www.noxelseo.com/" rel="noopener" ${A}>Open NOXEL SEO</a>.</p>
        <p ${P}><strong>NOXEL FORGE</strong> is a verified backlink exchange network. Members prove they own their domain, get a Trust Score, and exchange links only with partners in a close niche; every link is checked by the server. <a href="https://noxelforge.com/" rel="noopener" ${A}>Open NOXEL FORGE</a>.</p>
        <p ${P}><strong>NOXEL NEXUS</strong> is the language and region layer of NOXEL360: browse more than 250 countries, their official and indigenous languages, and switch the interface language in one click. It is included with your NOXEL360 account. <a href="/nexus" ${A}>Open NOXEL NEXUS</a>.</p>
        <p ${P}><strong>NOXEL SPECTRA</strong> prepares images and videos for the web: conversion to WebP and AVIF, compression, resizing, background removal, social media formats and short video tools. <a href="https://www.noxelspectra.com/" rel="noopener" ${A}>Open NOXEL SPECTRA</a>.</p>
        <h2 ${H2}>One account for the dashboard</h2>
        <p ${P}>Your NOXEL360 account covers the dashboard, NOXEL NEXUS and the <a href="/learn/" ${A}>Learn library</a>. NOXEL SEO and NOXEL FORGE keep their own sign-in and their own plans on their own sites; see <a href="/pricing/" ${A}>NOXEL360 pricing</a> and <a href="/team/" ${A}>the NOXEL team</a>.</p>`,
  },
  {
    route: "nexus",
    title: "NOXEL NEXUS — language and region intelligence | NOXEL360",
    description:
      "NOXEL NEXUS, part of NOXEL360: browse 250+ countries, their official and indigenous languages, and switch the interface language instantly.",
    crumb: "NOXEL NEXUS",
    body: `
        <h1 style="font-size:34px;font-weight:900;line-height:1.2;margin-bottom:20px;">NOXEL NEXUS: language and region intelligence for NOXEL360</h1>
        <p ${P}>NOXEL NEXUS is the language and region module of NOXEL360. Browse more than 250 countries on an interactive world map, explore their official and indigenous languages, and switch the interface language instantly.</p>
        <h2 ${H2}>What you can do with NOXEL NEXUS</h2>
        <p ${P}>Search a country, a capital or a language, filter by continent (Americas, Europe, Asia, Africa, Oceania) and apply a language of that country to the whole interface. Right-to-left languages switch the layout automatically.</p>
        <p ${P}>Languages of First Peoples and ancestral communities are shown with their own badge. NOXEL never publishes a machine translation for an indigenous language: only native speakers or translators approved by the community can provide one.</p>
        <h2 ${H2}>Included with NOXEL360</h2>
        <p ${P}>NOXEL NEXUS is included with your NOXEL360 account at no extra cost. It sits next to the other NOXEL modules on the <a href="/dashboard" ${A}>NOXEL360 dashboard</a>; see also <a href="/pricing/" ${A}>NOXEL360 pricing</a> and the <a href="/learn/" ${A}>Learn library</a>.</p>`,
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function setAttr(html, re, value, label) {
  if (!re.test(html)) throw new Error(`route-pages: ${label} introuvable dans index.html`);
  return html.replace(re, (_m, a, b) => `${a}${value}${b}`);
}

export function renderRoute(indexHtml, page) {
  const url = `${ORIGIN}/${page.route}`;
  let html = indexHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`);
  html = setAttr(html, /(<link rel="canonical" href=")[^"]*(")/, url, "canonical");
  html = setAttr(html, /(<meta name="description" content=")[^"]*(")/, esc(page.description), "description");
  html = setAttr(html, /(<meta property="og:title" content=")[^"]*(")/, esc(page.title), "og:title");
  html = setAttr(html, /(<meta property="og:description" content=")[^"]*(")/, esc(page.description), "og:description");
  html = setAttr(html, /(<meta property="og:url" content=")[^"]*(")/, url, "og:url");
  html = setAttr(html, /(<meta name="twitter:title" content=")[^"]*(")/, esc(page.title), "twitter:title");
  html = setAttr(html, /(<meta name="twitter:description" content=")[^"]*(")/, esc(page.description), "twitter:description");
  // Fil d'Ariane : Accueil > route
  html = html.replace(
    /("@type": "BreadcrumbList",\s*"itemListElement": \[)[\s\S]*?(\])/,
    `$1\n        { "@type": "ListItem", "position": 1, "name": "Home", "item": "${ORIGIN}/" },\n        { "@type": "ListItem", "position": 2, "name": "${page.crumb}", "item": "${url}" }\n      $2`
  );
  // La FAQ de l'accueil ne décrit pas cette page : on la retire.
  html = html.replace(/\s*<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/, "");
  // Contenu de secours propre à la route (remplacé par React au démarrage)
  const mainRe = /(<div id="root">[\s\S]*?<main[^>]*>)[\s\S]*?(<\/main>)/;
  if (!mainRe.test(html)) throw new Error("route-pages: <main> de secours introuvable");
  html = html.replace(mainRe, (_m, a, b) => `${a}${page.body}\n      ${b}`);
  return html;
}

export function writeRoutePages(dist) {
  const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  for (const page of ROUTE_PAGES) {
    fs.writeFileSync(path.join(dist, `${page.route}.html`), renderRoute(indexHtml, page));
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
  writeRoutePages(dist);
  console.log(`route-pages : ${ROUTE_PAGES.map((p) => `/${p.route}`).join(", ")} écrites dans dist/`);
}
