// src/constants/seoPenalties.ts
// ✅ Source unique de vérité pour la normalisation des pénalités (V1)
// Objectif: scores stables, comparables, explicables.

export type ScoreCategory =
  | "performance"
  | "accessibility"
  | "bestPractices"
  | "seo"
  | "security";

export type Severity = "critical" | "warning" | "info";

export type PenaltyDef = {
  category: ScoreCategory;
  points: number; // points retirés à la catégorie (0..100)
  severity: Severity;
  title: string; // label court humain
};

/**
 * IMPORTANT
 * - Les clés ici doivent matcher l'ID que ton backend renvoie pour chaque issue (IssueItem.id).
 * - Si un id n'est pas trouvé: on mettra une pénalité "unknown" (voir UNKNOWN_PENALTY).
 */
export const SEO_PENALTIES: Record<string, PenaltyDef> = {
  // -----------------------
  // SEO (Index / Meta)
  // -----------------------
  missing_title: {
    category: "seo",
    points: 10,
    severity: "critical",
    title: "Missing <title>",
  },

  title_too_short: {
    category: "seo",
    points: 3,
    severity: "info",
    title: "Title too short",
  },
  title_too_long: {
    category: "seo",
    points: 3,
    severity: "info",
    title: "Title too long",
  },
  duplicate_title: {
    category: "seo",
    points: 6,
    severity: "warning",
    title: "Duplicate title",
  },

  // IDs vus dans ton /seo/issues
  meta_title_length: {
    category: "seo",
    points: 4,
    severity: "warning",
    title: "Title length could be improved",
  },

  missing_meta_description: {
    category: "seo",
    points: 8,
    severity: "warning",
    title: "Missing meta description",
  },
  meta_description_missing: {
    category: "seo",
    points: 8,
    severity: "warning",
    title: "Missing meta description",
  },
  meta_description_length: {
    category: "seo",
    points: 3,
    severity: "info",
    title: "Meta description length could be improved",
  },
  meta_description_too_short: {
    category: "seo",
    points: 3,
    severity: "info",
    title: "Meta description too short",
  },
  meta_description_too_long: {
    category: "seo",
    points: 3,
    severity: "info",
    title: "Meta description too long",
  },

  // -----------------------
  // SEO (Headings / Canonical / Robots)
  // -----------------------
  missing_h1: {
    category: "seo",
    points: 6,
    severity: "warning",
    title: "Missing H1",
  },
  multiple_h1: {
    category: "seo",
    points: 4,
    severity: "warning",
    title: "Multiple H1",
  },
  // compat ids (certains scanners utilisent h1_missing / h1_multiple)
  h1_missing: {
    category: "seo",
    points: 6,
    severity: "warning",
    title: "Missing H1",
  },
  h1_multiple: {
    category: "seo",
    points: 4,
    severity: "warning",
    title: "Multiple H1",
  },

  canonical_missing: {
    category: "seo",
    points: 6,
    severity: "warning",
    title: "Missing canonical",
  },
  bp_canonical_missing: {
    category: "seo",
    points: 3,
    severity: "info",
    title: "Canonical link missing",
  },

  robots_noindex: {
    category: "seo",
    points: 20,
    severity: "critical",
    title: "Page not indexable (noindex)",
  },
  sitemap_missing: {
    category: "seo",
    points: 8,
    severity: "warning",
    title: "Sitemap missing",
  },
  robots_txt_missing: {
    category: "seo",
    points: 6,
    severity: "warning",
    title: "robots.txt missing",
  },

  // -----------------------
  // SEO (Content / Social previews / Structure)
  // -----------------------
  open_graph_missing: {
    category: "seo",
    points: 3,
    severity: "info",
    title: "Open Graph metadata missing/incomplete",
  },
  bp_open_graph_incomplete: {
    category: "seo",
    points: 2,
    severity: "info",
    title: "Open Graph metadata incomplete",
  },
  bp_twitter_card_missing: {
    category: "seo",
    points: 2,
    severity: "info",
    title: "Twitter Card metadata missing",
  },

  h2_missing: {
    category: "seo",
    points: 2,
    severity: "info",
    title: "No H2 sections detected",
  },
  thin_content: {
    category: "seo",
    points: 6,
    severity: "warning",
    title: "Page may have thin content",
  },

  // -----------------------
  // Performance
  // -----------------------
  ttfb_slow: {
    category: "performance",
    points: 10,
    severity: "warning",
    title: "Slow TTFB",
  },
  lcp_poor: {
    category: "performance",
    points: 10,
    severity: "warning",
    title: "Poor LCP",
  },
  cls_poor: {
    category: "performance",
    points: 8,
    severity: "warning",
    title: "Poor CLS",
  },
  inp_poor: {
    category: "performance",
    points: 8,
    severity: "warning",
    title: "Poor INP",
  },
  render_blocking_resources: {
    category: "performance",
    points: 6,
    severity: "info",
    title: "Render-blocking resources",
  },
  unoptimized_images: {
    category: "performance",
    points: 6,
    severity: "warning",
    title: "Unoptimized images",
  },
  missing_compression: {
    category: "performance",
    points: 8,
    severity: "warning",
    title: "Missing compression",
  },
  missing_caching: {
    category: "performance",
    points: 8,
    severity: "warning",
    title: "Missing caching headers",
  },

  // -----------------------
  // Accessibility
  // -----------------------
  img_missing_alt: {
    category: "accessibility",
    points: 4,
    severity: "warning",
    title: "Images missing alt",
  },
  aria_invalid: {
    category: "accessibility",
    points: 8,
    severity: "warning",
    title: "Invalid ARIA",
  },
  contrast_low: {
    category: "accessibility",
    points: 6,
    severity: "warning",
    title: "Low contrast",
  },
  form_label_missing: {
    category: "accessibility",
    points: 6,
    severity: "warning",
    title: "Form labels missing",
  },

  // -----------------------
  // Best Practices
  // -----------------------
  mixed_content: {
    category: "bestPractices",
    points: 10,
    severity: "critical",
    title: "Mixed content",
  },
  deprecated_api: {
    category: "bestPractices",
    points: 6,
    severity: "warning",
    title: "Deprecated API usage",
  },
  console_errors: {
    category: "bestPractices",
    points: 6,
    severity: "warning",
    title: "Console errors",
  },

  // bp_*
  bp_charset_missing: {
    category: "bestPractices",
    points: 3,
    severity: "warning",
    title: "Missing charset declaration",
  },
  bp_favicon_missing: {
    category: "bestPractices",
    points: 2,
    severity: "info",
    title: "Favicon missing",
  },

  // -----------------------
  // Security / Tech
  // -----------------------
  no_https: {
    category: "security",
    points: 25,
    severity: "critical",
    title: "No HTTPS",
  },
  hsts_missing: {
    category: "security",
    points: 8,
    severity: "warning",
    title: "HSTS missing",
  },
  csp_missing: {
    category: "security",
    points: 8,
    severity: "warning",
    title: "CSP missing",
  },
  x_frame_options_missing: {
    category: "security",
    points: 4,
    severity: "info",
    title: "X-Frame-Options missing",
  },
  x_content_type_options_missing: {
    category: "security",
    points: 4,
    severity: "info",
    title: "X-Content-Type-Options missing",
  },
};

// ✅ Pondérations V1 (total = 1.00)
export const SCORE_WEIGHTS: Record<ScoreCategory, number> = {
  performance: 0.25,
  accessibility: 0.2,
  bestPractices: 0.15,
  seo: 0.25,
  security: 0.15,
};

// ✅ Fallback si un issue.id n’existe pas encore dans SEO_PENALTIES
export const UNKNOWN_PENALTY: PenaltyDef = {
  category: "bestPractices",
  points: 2,
  severity: "info",
  title: "Unmapped issue",
};
