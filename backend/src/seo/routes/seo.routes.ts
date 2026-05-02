import { Router } from "express";
import { getHealth } from "../handlers/health.get";
import { getSeoSummary } from "../handlers/seo-summary.get";
import { getSeoScan } from "../handlers/seo-scan.get";
import { getSeoIssues } from "../handlers/seo-issues.get";

const router = Router();

router.get("/health", getHealth);
router.get("/summary", getSeoSummary);
router.get("/scan", getSeoScan);
router.get("/issues", getSeoIssues);

export default router;

