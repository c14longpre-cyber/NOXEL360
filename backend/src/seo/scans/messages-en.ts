export const scanMessages = {
  tech: {
    httpsMissing: {
      title: "[tech] HTTPS missing.",
      fix: "Enable HTTPS and redirect HTTP to HTTPS.",
    },
    canonicalMissing: {
      title: "[tech] Missing canonical.",
      fix: "Add a canonical tag to this page.",
    },
    robotsMissing: {
      title: "[tech] robots.txt not found.",
      fix: "Add an accessible robots.txt file.",
    },
    sitemapMissing: {
      title: "[tech] sitemap.xml not found.",
      fix: "Add a sitemap.xml and submit it.",
    },
    noindexDetected: {
      title: "[tech] Meta robots noindex detected.",
      fix: "Remove noindex if this page should be indexable.",
    },
    fetchFailed: (msg: string) => ({
      title: "[tech] Technical analysis failed.",
      fix: `The page could not be fetched: ${msg}`,
    }),
  },

  content: {
    titleMissing: {
      title: "[content] Add a unique <title>.",
      fix: "Add a descriptive <title> (50–60 characters).",
    },
    metaMissing: {
      title: "[content] Add a meta description.",
      fix: "Add a meta description (140–160 characters).",
    },
    h1Missing: {
      title: "[content] Add a visible H1.",
      fix: "Add one clear H1 near the top of the page.",
    },
    thinContent: {
      title: "[content] Thin content detected.",
      fix: "Add more useful content aligned with search intent.",
    },
    fetchFailed: (msg: string) => ({
      title: "[content] Analysis failed.",
      fix: `The content could not be fetched: ${msg}`,
    }),
  },
};