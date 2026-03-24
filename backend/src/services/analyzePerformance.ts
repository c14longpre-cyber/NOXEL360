export type AnalyzePerformanceResult = {
  performanceScore: number | null;
  lcp: string | null;
  cls: string | null;
  tbt: string | null;
};

export async function analyzePerformance(_url: string): Promise<AnalyzePerformanceResult> {
  return {
    performanceScore: null,
    lcp: null,
    cls: null,
    tbt: null,
  };
}
