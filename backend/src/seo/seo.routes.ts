import { Router } from "express";

export const seoRouter = Router();

type Severity = "critical" | "warning" | "info";

type IssueItem = {
  id: string;
  title: string;
  why: string;
  impact: string;
  fix: string;
  area: string;
  severity: Severity;
  weight: number;
};

function clampScore(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function seedFromUrl(url: string) {
  return [...url].reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function buildScores(url: string) {
  const seed = seedFromUrl(url);

  const performance = clampScore(58 + (seed % 35));
  const accessibility = clampScore(62 + ((seed * 3) % 33));
  const bestPractices = clampScore(60 + ((seed * 5) % 34));
  const seo = clampScore(64 + ((seed * 7) % 32));

  const scn = clampScore(seo - 6 + (seed % 12));
  const orbit = clampScore(seo - 10 + ((seed * 2) % 16));
  const schema = clampScore(seo - 14 + ((seed * 3) % 20));
  const crawl = clampScore(seo - 4 + ((seed * 4) % 12));

  const healthScore = clampScore(
    performance * 0.25 +
      accessibility * 0.2 +
      bestPractices * 0.2 +
      seo * 0.35
  );

  return {
    healthScore,
    scores: {
      seo,
      performance,
      accessibility,
      bestPractices,
    },
    seoModules: {
      scn,
      orbit,
      schema,
      crawl,
    },
  };
}

function buildIssues(url: string, scores = buildScores(url)) {
  const issues: Record<Severity, IssueItem[]> = {
    critical: [],
    warning: [],
    info: [],
  };

  const add = (severity: Severity, item: Omit<IssueItem, "severity">) => {
    issues[severity].push({ ...item, severity });
  };

  if (scores.healthScore < 75) {
    add("critical", {
      id: "critical-global-score",
      title: "Global SEO health needs attention",
      why: "The overall score is below the recommended production threshold.",
      impact: "Lower technical quality can reduce visibility, trust, and conversion.",
      fix: "Prioritize the highest-weight SEO, performance, and crawlability issues first.",
      area: "global",
      weight: 10,
    });
  }

  if (scores.scores.performance < 80) {
    add("warning", {
      id: "warning-performance",
      title: "Performance score could be improved",
      why: "The page may be loading slower than ideal.",
      impact: "Slow pages can hurt user experience and search performance.",
      fix: "Compress images, reduce unused JavaScript, and improve caching.",
      area: "performance",
      weight: 7,
    });
  }

  if (scores.scores.seo < 85) {
    add("warning", {
      id: "warning-seo-basics",
      title: "SEO fundamentals need review",
      why: "Core SEO signals are not yet at a strong level.",
      impact: "Search engines may have less context to rank the page properly.",
      fix: "Review title tags, meta descriptions, headings, canonical tags, and internal links.",
      area: "seo",
      weight: 8,
    });
  }

  if (scores.seoModules.schema < 80) {
    add("warning", {
      id: "warning-schema",
      title: "Structured data opportunity detected",
      why: "Schema coverage appears weaker than the rest of the SEO profile.",
      impact: "You may miss rich result opportunities in search engines.",
      fix: "Add or validate Organization, WebSite, Breadcrumb, Product, or Article schema where relevant.",
      area: "schema",
      weight: 6,
    });
  }

  add("info", {
    id: "info-last-scan",
    title: "Scan completed successfully",
    why: `NOXEL SEO analyzed ${url}.`,
    impact: "The dashboard now has a fresh baseline for this URL.",
    fix: "Use this report as a starting point before connecting deeper crawlers and Lighthouse metrics.",
    area: "system",
    weight: 1,
  });

  add("info", {
    id: "info-next-step",
    title: "Next step: connect real audit signals",
    why: "This version now produces dynamic URL-based scores and issue messages.",
    impact: "Scores vary by URL, but they are still simulated until real HTML/performance analysis is connected.",
    fix: "Connect HTML parsing, metadata checks, image alt checks, sitemap checks, robots checks, and performance audits.",
    area: "roadmap",
    weight: 1,
  });

  return issues;
}

seoRouter.get("/health", (_req, res) => {
  res.json({
    ok: true,
    status: "ok",
    service: "noxel-seo",
    uptimeSec: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

seoRouter.get("/vm/summary", (req, res) => {
  const url = String(req.query.url || "https://example.com");
  const scores = buildScores(url);
  const issues = buildIssues(url, scores);

  res.json({
    ok: true,
    website: {
      url,
      status: "ready",
      healthScore: scores.healthScore,
      scores: scores.scores,
      seoModules: scores.seoModules,
      issuesCount: {
        critical: issues.critical.length,
        warning: issues.warning.length,
        info: issues.info.length,
      },
      lastScan: new Date().toISOString(),
      runId: `scan_${seedFromUrl(url)}_${Date.now()}`,
    },
  });
});

seoRouter.get("/issues", (req, res) => {
  const url = String(req.query.url || "https://example.com");
  const scores = buildScores(url);
  const issues = buildIssues(url, scores);

  res.json({
    ok: true,
    issues,
  });
});