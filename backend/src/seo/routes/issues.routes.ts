import { Router } from "express";
import { getSeoIssues } from "../handlers/seo-issues.get";

const router = Router();

router.get("/issues", getSeoIssues);

export default router;
