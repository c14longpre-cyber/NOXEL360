export {};

import type { IssuesPayload, IssueItem } from "./issue.types";

export type ScoreBreakdown = {
  globalScore: number;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  seoModules: {
    scn: number;
    orbit: number;
    schema: number;
    crawl: number;
  };
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function norm(value?: string) {
  return String(value ?? "").trim().toLowerCase();
}

function includesAny(text: string, patterns: string[]) {
  return patterns.some((p) => text.includes(p));
}

function issueText(issue: IssueItem) {
  return [
    issue.title,
    issue.why,
    issue.fix,
    issue.impact,
    issue.severity,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function classifySeoModules(issue: IssueItem) {
  const text = issueText(issue);

  const isSchema = includesAny(text, [
    "schema",
    "structured data",
    "json-ld",
    "json ld",
    "microdata",
    "rich results",
    "rich snippets",
    "faq schema",
    "organization schema",
    "article schema",
    "product schema",
    "breadcrumb schema",
    "entity markup",
  ]);

  const isCrawl = includesAny(text, [
    "crawl",
    "crawler",
    "robots.txt",
    "noindex",
    "canonical",
    "indexing",
    "redirect",
    "redirect chain",
    "sitemap",
    "status code",
    "404",
    "500",
    "broken link",
    "discoverability",
    "internal linking",
    "orphan page",
    "crawl budget",
    "blocked resource",
  ]);

  const isScn = includesAny(text, [
    "semantic",
    "content quality",
    "thin content",
    "duplicate content",
    "keyword",
    "topic",
    "intent",
    "headings",
    "heading",
    "h1",
    "h2",
    "title tag",
    "meta description",
    "copy",
    "topical coverage",
    "entity coverage",
    "content depth",
    "content relevance",
    "semantic content network",
  ]);

  const isOrbit = includesAny(text, [
    "backlink",
    "backlinks",
    "authority",
    "trust",
    "brand signal",
    "entity authority",
    "external links",
    "link equity",
    "anchor text",
    "reputation",
    "serp context",
    "ranking ecosystem",
    "competitive context",
  ]);

  return {
    scn: isScn,
    orbit: isOrbit,
    schema: isSchema,
    crawl: isCrawl,
  };
}

function computeModuleScore(
  issues: IssueItem[],
  pick: (issue: IssueItem) => boolean,
  fallbackFromBase: number,
  criticalPenalty: number,
  warningPenalty: number,
  infoPenalty: number
) {
  let critical = 0;
  let warning = 0;
  let info = 0;

  for (const issue of issues) {
    if (!pick(issue)) continue;

    const sev = norm(issue.severity);
    if (sev === "critical" || sev === "high") critical += 1;
    else if (sev === "warning" || sev === "medium") warning += 1;
    else info += 1;
  }

  return clamp(
    Math.round(
      fallbackFromBase -
        critical * criticalPenalty -
        warning * warningPenalty -
        info * infoPenalty
    )
  );
}

export function computeScoresFromIssues(issues: IssuesPayload): ScoreBreakdown {
  const allIssues: IssueItem[] = [
    ...issues.critical,
    ...issues.warning,
    ...issues.info,
  ];

  const c = issues.critical.length;
  const w = issues.warning.length;
  const i = issues.info.length;

  const base = clamp(100 - (c * 10 + w * 4 + i * 1));

  const seo = clamp(base - c * 2);
  const performance = clamp(base - w * 1);
  const accessibility = clamp(base - i * 1);
  const bestPractices = clamp(base - c * 1);

  const scn = computeModuleScore(
    allIssues,
    (issue) => classifySeoModules(issue).scn,
    seo,
    9,
    4,
    1
  );

  const orbit = computeModuleScore(
    allIssues,
    (issue) => classifySeoModules(issue).orbit,
    seo,
    8,
    3,
    1
  );

  const schema = computeModuleScore(
    allIssues,
    (issue) => classifySeoModules(issue).schema,
    seo,
    12,
    5,
    2
  );

  const crawl = computeModuleScore(
    allIssues,
    (issue) => classifySeoModules(issue).crawl,
    seo,
    11,
    5,
    2
  );

  const globalScore = clamp(
    Math.round(
      (
        seo +
        performance +
        accessibility +
        bestPractices +
        scn +
        orbit +
        schema +
        crawl
      ) / 8
    )
  );

  return {
    globalScore,
    performance,
    accessibility,
    bestPractices,
    seo,
    seoModules: {
      scn,
      orbit,
      schema,
      crawl,
    },
  };
}