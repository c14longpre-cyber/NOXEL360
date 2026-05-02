import type { ReportModel } from "../types/global.types";
import fs from "fs";
import path from "path";

export async function generatePdf(report: ReportModel): Promise<string> {
  // V1 placeholder: crée un fichier JSON (remplacé par Puppeteer ensuite)
  // TODO: build HTML template + render PDF
  const outDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const filename = `report-${Date.now()}.json`;
  const full = path.join(outDir, filename);

  fs.writeFileSync(full, JSON.stringify(report, null, 2), "utf8");
  return full;
}
