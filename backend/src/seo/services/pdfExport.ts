// services/pdfExport.ts
import PDFDocument from "pdfkit";
import type { GlobalScanPayload } from "./scanOrchestrator";

export function buildGlobalPdf(payload: GlobalScanPayload): Buffer {
  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];

  doc.on("data", (c: Buffer) => chunks.push(c));
  // @ts-ignore
  doc.on("error", () => {});

  doc.fontSize(18).text("NOXEL SEO — Rapport Global", { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`URL: ${payload.url}`);
  doc.text(`Date: ${payload.createdAt}`);
  doc.moveDown();

  doc.fontSize(14).text(`Global Score: ${payload.globalScore}/100`);
  doc.moveDown();

  doc.fontSize(12).text("Scores par scan:");
  doc.text(`Tech: ${payload.scores.tech} | Perf: ${payload.scores.perf} | Contenu: ${payload.scores.content}`);
  doc.text(`Architecture: ${payload.scores.architecture} | Backlinks: ${payload.scores.backlinks} | Structured Data: ${payload.scores.structuredData}`);
  doc.moveDown();

  doc.fontSize(12).text(`Issues (${payload.issues.length}):`);
  doc.moveDown(0.5);

  for (const it of payload.issues.slice(0, 300)) {
    doc.fontSize(11).text(`[${it.area}] ${it.title}`);
    doc.fontSize(10).text(`Why: ${it.why}`);
    doc.text(`Impact: ${it.impact}`);
    doc.text(`Fix: ${it.fix}`);
    doc.moveDown();
  }

  doc.end();
  return Buffer.concat(chunks);
}
