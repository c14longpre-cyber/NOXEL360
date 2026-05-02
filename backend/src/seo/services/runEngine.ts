// backend/src/services/runEngine.ts
import type { ScanMode, ScanContext, ScanPlugin } from "../scans/scan.types";
import { runBundle, mergeIssues } from "../scans/scan.bundle";
import { scanRegistry } from "../scans/registry";
import { createRun, setRunStatus, updateRun } from "../runs/run.store";
import { logger } from "../shared/logger";

/**
 * Start a new SEO run for a given URL.
 * - Always creates a fresh run (unique runId)
 * - Updates status safely (running -> done|error)
 * - Stores bundle + merged issues on the run record
 */
export async function startRun(url: string, mode: ScanMode = "quick") {
  const run = createRun(url);

  // Mark as running (store owns status)
  setRunStatus(run.runId, "running");

  const ctx: ScanContext = {
    url,
    mode,
    nowIso: new Date().toISOString(),
    runId: run.runId, // ✅ helpful for plugins/logging (extra field is OK in TS if ScanContext allows it)
  } as ScanContext;

  try {
    const plugins: ScanPlugin[] = scanRegistry;

    // ✅ Run all plugin runners
    const bundle = await runBundle(
      ctx,
      plugins.map((p) => p.run)
    );

    // ✅ Merge all issues from bundle results
    const issues = mergeIssues(bundle.results);

    // ✅ Persist run (single update)
    updateRun(run.runId, {
      status: "done",
      finishedAt: new Date().toISOString(),
      scans: bundle,
      issues,
    });

    return { ok: true, runId: run.runId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    logger.error("Run failed", msg);

    updateRun(run.runId, {
      status: "error",
      finishedAt: new Date().toISOString(),
      errorMessage: msg,
    });

    return { ok: false, runId: run.runId, error: msg };
  }
}