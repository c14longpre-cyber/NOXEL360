import type { ScanPlugin, ScanContext, ScanResult } from "./scan.types";

import { techScan } from "./plugins/tech.scan";
import { contentScan } from "./plugins/content.scan";

export type ScanOutput = ScanResult<any>;

export const SCANS: ScanPlugin<any>[] = [
  techScan,
  contentScan,
];

export function getScan(scanId: string): ScanPlugin<any> | undefined {
  return SCANS.find((s) => s.id === scanId);
}

export type { ScanPlugin, ScanContext };