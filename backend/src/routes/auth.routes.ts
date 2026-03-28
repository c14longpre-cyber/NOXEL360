import { Router } from "express";
import { authGoogle } from "../handlers/auth-google.post";
import { getAuthMe } from "../handlers/auth-me.get";

const router = Router();

router.post("/google", authGoogle);
router.get("/me", getAuthMe);

export default router;
