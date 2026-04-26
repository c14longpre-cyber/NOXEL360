import { Router } from "express";

export const router = Router();

// Virtual Assistant Builder – création/config placeholder
router.post("/create", (req, res) => {
  const { name, personality, languages } = req.body;

  res.json({
    ok: true,
    module: "assistant",
    assistant: {
      id: "demo-assistant-1",
      name,
      personality,
      languages
    }
  });
});
