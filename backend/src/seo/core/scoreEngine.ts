import type { FullScanResult, Priority, ModuleResult } from "../types/global.types";

const WEIGHTS: Record<string, number> = {
  technical: 0.25,
  performance: 0.20,
  content: 0.20,
  architecture: 0.15,
  backlinks: 0.10,
  structuredData: 0.10
};

function computePriority(globalScore: number): Priority {
  if (globalScore < 40) return "Critical";
  if (globalScore < 60) return "High";
  if (globalScore < 80) return "Medium";
  return "Low";
}

export function computeGlobalScores(modules: Record<string, ModuleResult>) {
  let sum = 0;

  for (const key of Object.keys(modules)) {
    const weight = WEIGHTS[key] ?? 0;
    sum += (modules[key].score ?? 0) * weight;
  }

  const global = Math.round(sum);
  const breakdown: Record<string, number> = {};
  for (const key of Object.keys(modules)) breakdown[key] = modules[key].score ?? 0;

  return {
    global,
    breakdown,
    priority: computePriority(global)
  };
}
