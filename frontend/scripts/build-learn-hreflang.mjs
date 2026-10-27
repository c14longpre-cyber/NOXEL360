#!/usr/bin/env node
/**
 * NOXEL360 — canonical + hreflang des pages Learn (public/learn/), à partir
 * des fichiers réellement présents sur le disque.
 *
 * - Chaque page est sa propre canonical : /learn/fr/what-is-dns.html pointe vers
 *   elle-même, plus vers la page anglaise (sinon Google la traite en doublon).
 * - Les hreflang ne listent que les versions qui existent : une page présente en
 *   anglais et en français n'annonce que en, fr et x-default.
 * - og:url, mainEntityOfPage et le url de la CollectionPage suivent la canonical.
 *
 * Idempotent. À relancer après tout ajout, retrait ou traduction de page Learn :
 *   node scripts/build-learn-hreflang.mjs          (écrit)
 *   node scripts/build-learn-hreflang.mjs --check  (n'écrit rien, code 1 si un fichier changerait)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://noxel360.com";
const here = path.dirname(fileURLToPath(import.meta.url));
const LEARN = path.resolve(here, "..", "public", "learn");
const CHECK = process.argv.includes("--check");

/** Dossiers dont le code d'URL n'est pas le code hreflang. */
const HREFLANG_OF_FOLDER = { iw: "he", jw: "jv", zh: "zh-CN" };

/** Code hreflang valide (ISO 639-1, avec région éventuelle), sinon null. */
export function hreflangOf(folder) {
  const code = HREFLANG_OF_FOLDER[folder] ?? folder;
  return /^[a-z]{2}(-[A-Z]{2}|-[A-Z][a-z]{3})?$/.test(code) ? code : null;
}

/** URL publique d'une page Learn ("" = anglais ; index.html = dossier). */
export function learnUrl(folder, file) {
  const base = folder ? `${ORIGIN}/learn/${folder}/` : `${ORIGIN}/learn/`;
  return file === "index.html" ? base : base + file;
}

function htmlFiles(dir) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".html") && fs.statSync(path.join(dir, f)).isFile()).sort()
    : [];
}

export function collect(learnDir = LEARN) {
  const folders = fs
    .readdirSync(learnDir)
    .filter((d) => fs.statSync(path.join(learnDir, d)).isDirectory())
    .sort();
  /** fichier → [{ folder, code }] */
  const versions = new Map();
  const add = (folder, file) => {
    if (!versions.has(file)) versions.set(file, []);
    versions.get(file).push({ folder, code: folder ? hreflangOf(folder) : "en" });
  };
  for (const f of htmlFiles(learnDir)) add("", f);
  for (const d of folders) for (const f of htmlFiles(path.join(learnDir, d))) add(d, f);
  return { folders, versions };
}

export function hreflangBlock(file, list) {
  const lines = list
    .filter((v) => v.code)
    .map((v) => `  <link rel="alternate" hreflang="${v.code}" href="${learnUrl(v.folder, file)}" />`);
  const en = list.find((v) => v.folder === "");
  if (en) lines.push(`  <link rel="alternate" hreflang="x-default" href="${learnUrl("", file)}" />`);
  return lines.length > 1 ? lines.join("\n") + "\n" : "";
}

/**
 * Fil d'Ariane d'une page traduite : chaque élément pointe vers la même page
 * dans la langue de la page quand elle existe (sinon il reste en anglais).
 */
function localizeBreadcrumb(html, folder, exists) {
  if (!folder) return html;
  return html.replace(/("item"\s*:\s*")https:\/\/noxel360\.com\/learn(?:\/([^"\/]*\.html))?\/?(")/g, (m, a, target, b) => {
    const f = target || "index.html";
    return exists(folder, f) ? `${a}${learnUrl(folder, f)}${b}` : m;
  });
}

export function rewrite(html, folder, file, list, exists = () => false) {
  const self = learnUrl(folder, file);
  let out = html
    // anciens blocs hreflang (y compris la coquille « qreflang »), où qu'ils soient
    .replace(/[ \t]*<link rel="alternate" [hq]reflang="[^"]*" href="[^"]*"\s*\/?>[ \t]*\r?\n?/g, "")
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${self}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${self}$2`)
    .replace(/("mainEntityOfPage"\s*:\s*")https:\/\/noxel360\.com\/learn[^"]*(")/g, `$1${self}$2`);
  out = localizeBreadcrumb(out, folder, exists);
  if (file === "index.html") {
    out = out.replace(/("@type"\s*:\s*"CollectionPage"[^}]*?"url"\s*:\s*")https:\/\/noxel360\.com\/learn[^"]*(")/, `$1${self}$2`);
  }
  if (!/<link rel="canonical"/.test(out)) {
    out = out.replace(/<\/title>/, `</title>\n<link rel="canonical" href="${self}" />`);
  }
  const block = hreflangBlock(file, list);
  return block ? out.replace(/<\/head>/, `${block}</head>`) : out;
}

function main() {
  const { versions } = collect();
  const exists = (folder, f) => (versions.get(f) || []).some((v) => v.folder === folder);
  let changed = 0;
  let pages = 0;
  for (const [file, list] of versions) {
    for (const v of list) {
      const p = path.join(LEARN, v.folder, file);
      const before = fs.readFileSync(p, "utf8");
      const after = rewrite(before, v.folder, file, list, exists);
      pages++;
      if (after !== before) {
        changed++;
        if (!CHECK) fs.writeFileSync(p, after);
      }
    }
  }
  console.log(`${pages} pages Learn, ${changed} ${CHECK ? "à mettre à jour" : "mises à jour"}.`);
  if (CHECK && changed) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
