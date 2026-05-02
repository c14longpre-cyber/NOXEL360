import * as cheerio from "cheerio";
import type { ModuleResult, IssueItem } from "../../types/global.types";
import type { FetchPageResult } from "../../services/fetchPage";

export async function runContentScan(page: FetchPageResult): Promise<ModuleResult> {
  const $ = cheerio.load(page.html || "");

  const title = ($("title").first().text() || "").trim();
  const metaDesc = ($('meta[name="description"]').attr("content") || "").trim();

  const h1Count = $("h1").length;

  const imgs = $("img").toArray();
  const imgCount = imgs.length;
  const missingAlt = imgs.filter((el) => !($(el).attr("alt") || "").trim()).length;

  const canonical = ($('link[rel="canonical"]').attr("href") || "").trim();

  let score = 100;
  if (!title) score -= 25;
  if (!metaDesc) score -= 20;
  if (h1Count === 0) score -= 15;
  if (h1Count > 1) score -= 10;
  if (imgCount > 0 && missingAlt > 0) {
    score -= Math.min(20, Math.round((missingAlt / imgCount) * 20));
  }
  if (!canonical) score -= 10;

  score = Math.max(0, Math.min(100, score));

  const issues: IssueItem[] = [];
  const rec: string[] = [];

  if (!title) rec.push("Ajouter un <title> unique et descriptif.");
  if (!metaDesc) rec.push("Ajouter une meta description (140–160 caractères).");
  if (h1Count === 0) rec.push("Ajouter un H1 principal sur la page.");
  if (h1Count > 1) rec.push("Réduire à 1 seul H1 principal (éviter plusieurs H1).");
  if (imgCount > 0 && missingAlt > 0) rec.push("Ajouter des attributs ALT aux images importantes.");
  if (!canonical) rec.push("Ajouter une balise canonical cohérente.");

  return {
    moduleId: "content",
    score,
    issues,
    recommendations: rec,
    metrics: {
      url: page.finalUrl,
      titlePresent: Boolean(title),
      metaDescriptionPresent: Boolean(metaDesc),
      h1Count,
      images: imgCount,
      imagesMissingAlt: missingAlt,
      canonicalPresent: Boolean(canonical),
    },
  };
}
