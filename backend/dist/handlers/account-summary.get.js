"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountSummary = getAccountSummary;
const accountSummary_1 = require("../data/accountSummary");
function getAccountSummary(_req, res) {
    res.json({
        ok: true,
        data: accountSummary_1.accountSummary,
    });
}
