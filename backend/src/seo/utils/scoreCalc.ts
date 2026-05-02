// utils/scoreCalc.ts
import type { IssueItem } from "../scans/types";


export type Scores = {
  tech: number;
  perf: number;
  content: number;
  architecture: number;
  backlinks: number;
  structuredData: number;
  global: number;
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function computeScoresFromIssues(issues: IssueItem[] = []): Scores {
  // ✅ Default perfect
  const base: Scores = {
    tech: 100,
    perf: 100,
    content: 100,
    architecture: 100,
    backlinks: 100,
    structuredData: 100,
    global: 100,
  };

  if (!issues.length) return base;

  // Exemple: chaque issue peut contenir area + weight (sinon fallback)
  const penalties = {
    tech: 0,
    perf: 0,
    content: 0,
    architecture: 0,
    backlinks: 0,
    structuredData: 0,
  };

  for (const it of issues) {
    const area = (it as any).area as keyof typeof penalties | undefined;
    const weight = Number((it as any).weight ?? 5); // fallback
    if (area && penalties[area] !== undefined) penalties[area] += weight;
  }

  const tech = clamp(100 - penalties.tech);
  const perf = clamp(100 - penalties.perf);
  const content = clamp(100 - penalties.content);
  const architecture = clamp(100 - penalties.architecture);
  const backlinks = clamp(100 - penalties.backlinks);
  const structuredData = clamp(100 - penalties.structuredData);

  const global = clamp(
    (tech + perf + content + architecture + backlinks + structuredData) / 6
  );

  return { tech, perf, content, architecture, backlinks, structuredData, global };
}
