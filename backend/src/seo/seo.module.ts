/**
 * NOXEL SEO — Module routes
 * Intégré dans NOXEL360 backend sur /api/seo/*
 */
import { Router } from "express";
import { getHealth } from "./handlers/health.get";
import { getSeoSummary } from "./handlers/seo-summary.get";
import { getSeoScan } from "./handlers/seo-scan.get";
import { getSeoIssues } from "./handlers/seo-issues.get";
import seoCompatRoutes from "./routes/seo-compat.routes";
import seoVmRoutes from "./routes/seo-vm.routes";
import scanRoutes from "./routes/scan.routes";

const router = Router();

// Health
router.get("/health", getHealth);

// Core SEO endpoints
router.get("/summary", getSeoSummary);
router.get("/scan", getSeoScan);
router.get("/issues", getSeoIssues);

// VM routes (viewmodel layer)
router.use("/vm", seoVmRoutes);

// Compat routes
router.use("/", seoCompatRoutes);

// Generic scan plugins
router.use("/", scanRoutes);

export const seoModuleRouter = router;
