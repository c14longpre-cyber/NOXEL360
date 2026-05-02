import type { ScanPlugin } from "./scan.types";

export const lighthouseScan: ScanPlugin = {
  id: "performance",
  label: "Lighthouse (disabled)",
  async run() {
    return {
      scanId: "performance",
      ok: true,
      durationMs: 0,
      metrics: { disabled: true },
      issues: {
        critical: [],
        warning: [],
        info: [],
      },
      artifacts: {
        note: "Lighthouse scan is temporarily disabled during engine refactor.",
      },
    };
  },
};