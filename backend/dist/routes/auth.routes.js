"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_google_post_1 = require("../handlers/auth-google.post");
const auth_me_get_1 = require("../handlers/auth-me.get");
const router = (0, express_1.Router)();
router.post("/google", auth_google_post_1.authGoogle);
router.get("/me", auth_me_get_1.getAuthMe);
exports.default = router;
