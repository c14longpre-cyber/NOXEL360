import type { ScanPlugin } from "./scan.types";

import { renderDeltaScan } from "./plugins/render-delta.scan";
import { performanceScan } from "./plugins/performance.scan";
import { contentScan } from "./plugins/content.scan";
import { uxScan } from "./plugins/ux.scan";
import { imagesScan } from "./plugins/images.scan";
import { linksScan } from "./plugins/links.scan";

export const scanRegistry: ScanPlugin[] = [
  renderDeltaScan,
  performanceScan,
  contentScan,
  uxScan,
  imagesScan,
  linksScan,
];