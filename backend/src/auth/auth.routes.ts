import { Router } from "express";
import {
  getSession,
  handleOAuthCallback,
  postLogout,
  postResolveExistingEmail,
  startOAuth,
} from "./auth.controller";

export const authRouter = Router();

authRouter.get("/session", getSession);
authRouter.get("/me", getSession);
authRouter.post("/logout", postLogout);
authRouter.post("/resolve-existing-email", postResolveExistingEmail);

authRouter.get("/:provider/start", startOAuth);
authRouter.get("/:provider/callback", handleOAuthCallback);

