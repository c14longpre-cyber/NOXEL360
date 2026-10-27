// Pages statiques : canonical, hreflang et sitemaps à jour — `npm test` (frontend/)
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { hreflangOf, learnUrl, rewrite } from "../scripts/build-learn-hreflang.mjs";

const run = (script) => execFileSync("node", [script, "--check"], { encoding: "utf8" });

test("hreflang codes: legacy folders mapped, three-letter codes left out", () => {
  assert.equal(hreflangOf("fr"), "fr");
  assert.equal(hreflangOf("iw"), "he");
  assert.equal(hreflangOf("zh"), "zh-CN");
  assert.equal(hreflangOf("pt-BR"), "pt-BR");
  assert.equal(hreflangOf("ceb"), null);
});

test("a translated page is its own canonical and lists only versions that exist", () => {
  const html = `<html><head><title>x</title><link rel="canonical" href="https://noxel360.com/learn/a.html" />
<meta property="og:url" content="https://noxel360.com/learn/a.html" />
  <link rel="alternate" hreflang="de" href="https://noxel360.com/learn/de/a.html" />
</head></html>`;
  const out = rewrite(html, "fr", "a.html", [{ folder: "", code: "en" }, { folder: "fr", code: "fr" }]);
  assert.match(out, /rel="canonical" href="https:\/\/noxel360\.com\/learn\/fr\/a\.html"/);
  assert.match(out, /og:url" content="https:\/\/noxel360\.com\/learn\/fr\/a\.html"/);
  assert.doesNotMatch(out, /hreflang="de"/);
  assert.match(out, /hreflang="x-default" href="https:\/\/noxel360\.com\/learn\/a\.html"/);
  assert.equal(learnUrl("fr", "index.html"), "https://noxel360.com/learn/fr/");
});

test("Learn pages and sitemaps are up to date (rerun the scripts after editing pages)", () => {
  run("scripts/build-learn-hreflang.mjs");
  run("scripts/build-sitemap.mjs");
});

test("every SPA route in App.tsx is rewritten to index.html, and nothing else is", () => {
  const v = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
  const sources = v.rewrites.map((r) => r.source);
  for (const s of ["/(dashboard|nexus|privacy|terms)", "/app", "/app/:path*", "/auth/:path*"]) assert.ok(sources.includes(s), s);
  assert.ok(!sources.some((s) => s.includes(".*")), "no catch-all rewrite: unknown pages must answer 404");
  assert.ok(fs.existsSync("public/404.html"));
});

test("share image and logo exist", () => {
  for (const f of ["og-image.png", "favicon-512x512.png", "apple-touch-icon.png"]) assert.ok(fs.existsSync(`public/${f}`), f);
});
