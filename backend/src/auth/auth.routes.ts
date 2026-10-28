import { Router } from "express";
import {
  getSession,
  handleOAuthCallback,
  postLogout,
  postResolveExistingEmail,
  startOAuth,
} from "./auth.controller";
import { linkLimiter, oauthLimiter, sessionLimiter } from "../middleware/authLimiter";

export const authRouter = Router();

authRouter.get("/session", sessionLimiter, getSession);
authRouter.get("/me", sessionLimiter, getSession);
authRouter.post("/logout", sessionLimiter, postLogout);
authRouter.post("/resolve-existing-email", linkLimiter, postResolveExistingEmail);

authRouter.get("/:provider/start", oauthLimiter, startOAuth);
authRouter.get("/:provider/callback", oauthLimiter, handleOAuthCallback);

