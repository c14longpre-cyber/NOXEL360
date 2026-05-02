// backend/src/config/lighthouse.config.ts
// Config "mobile-like" proche PageSpeed (simulate throttling)
export const lighthouseConfig = {
  extends: "lighthouse:default",
  settings: {
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: "mobile",
    throttlingMethod: "simulate",
    throttling: {
      cpuSlowdownMultiplier: 4,
      // valeurs raisonnables; tu peux ajuster plus tard
      rttMs: 150,
      throughputKbps: 1600,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1600,
      uploadThroughputKbps: 750,
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
    emulatedUserAgent: "mobile",
    maxWaitForLoad: 60000,
  },
};
