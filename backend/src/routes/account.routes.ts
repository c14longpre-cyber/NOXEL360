import { Router } from "express";

const router = Router();

router.get("/summary", (_req, res) => {
  res.json({
    ok: true,
    data: {
      profile: {
        name: "Christian Longpré",
        email: "christian@noxel360.com",
        language: "English",
        workspace: "NOXEL360"
      },
      billing: {
        tier: "Diamond",
        status: "Active",
        renewalDate: "2026-04-15",
        plan: "Full Platform Access"
      },
      preferences: {
        theme: "Default Noxel",
        notifications: "Enabled",
        interfaceMode: "Standard",
        morphProfile: "Not configured yet"
      },
      security: {
        password: "Configured",
        twoFactor: "Coming soon",
        lastLogin: "Today",
        sessionProtection: "Active"
      }
    }
  });
});

export default router;