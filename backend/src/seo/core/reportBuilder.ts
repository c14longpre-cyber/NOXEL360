import type { FullScanResult, ReportModel, Priority } from "../types/global.types";

function labelForModule(moduleId: string) {
  const map: Record<string, string> = {
    technical: "Technique",
    performance: "Performance (Core Web Vitals)",
    content: "Contenu",
    architecture: "Architecture & Maillage interne",
    backlinks: "Backlinks & Autorité",
    structuredData: "Données structurées"
  };
  return map[moduleId] ?? moduleId;
}

export function buildReport(scan: FullScanResult): ReportModel {
  const categoryScores = Object.keys(scan.modules).map((moduleId) => {
    const score = scan.modules[moduleId].score ?? 0;
    const priority: Priority =
      score < 40 ? "Critical" :
      score < 60 ? "High" :
      score < 80 ? "Medium" : "Low";

    return {
      moduleId,
      label: labelForModule(moduleId),
      score,
      priority
    };
  });

  return {
    executiveSummary: {
      siteName: scan.url,
      url: scan.url,
      scannedAt: scan.scannedAt,
      globalScore: scan.scores.global,
      priority: scan.scores.priority,
      highlights: [
        "Problèmes détectés, impacts potentiels et actions recommandées.",
        "Rapport généré automatiquement par Noxel SEO."
      ]
    },
    categoryScores,
    detailedAnalysis: scan.modules,
    roadmap30Days: [
      { action: "Corriger les erreurs critiques", priority: "Critical", impact: "Indexation & UX", effort: "High", deadlineDays: 7 },
      { action: "Optimiser Core Web Vitals", priority: "High", impact: "Ranking & conversions", effort: "Medium", deadlineDays: 14 },
      { action: "Optimiser titles/metas/H1/ALT", priority: "Medium", impact: "CTR & pertinence", effort: "Low", deadlineDays: 21 }
    ],
    projections: {
      trafficOrganic: "+20 à +50 %",
      conversions: "+10 à +30 %",
      visibility: "+15 à +40 %",
      bounceRate: "-10 à -25 %"
    },
    conclusion:
      "Le site présente un bon potentiel SEO, mais plusieurs optimisations techniques et structurelles sont nécessaires pour améliorer sa visibilité et ses performances. Noxel SEO fournit une feuille de route claire, priorisée et actionnable."
  };
}
