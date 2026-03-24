"use strict";
// backend/src/routes/seoKeywords.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoKeywords = void 0;
/**
 * Liste regroupée de mots-clés scannés par Noxel360.
 * Chaque catégorie est fusionnée automatiquement.
 */
// Catégories originales
const keywordGroups = {
    cosmetics: [
        "anti-aging cream", "BB cream for sensitive skin", "blemish control",
        "clean beauty products", "collagen booster", "cruelty free beauty",
        "eco-friendly packaging", "fragrance-free skincare", "hydrating serum",
        "mineral foundation", "natural cosmetics", "non-toxic makeup",
        "organic makeup", "paraben free", "pore minimizing primer",
        "retinol night cream", "skin care routine", "SPF moisturizer",
        "sustainable beauty", "vegan skincare"
    ],
    generic: [
        "best prices", "book your free demo", "certified professionals",
        "contact us today", "customer reviews", "discover the difference",
        "exclusive deals", "expert support", "fast and secure checkout",
        "free consultation", "get started now", "join our community",
        "limited-time offer", "no hidden fees", "online services",
        "proven results", "satisfaction guaranteed", "subscribe for updates",
        "trusted company", "your success is our mission"
    ],
    restaurant: [
        "best restaurant near me", "brunch spots", "buffet near me",
        "ethnic food near me", "family restaurant", "farm-to-table restaurants",
        "fine dining experience", "food delivery apps", "gluten-free menu",
        "happy hour deals", "kids-friendly restaurants", "local cuisine",
        "open late restaurants", "pet-friendly patios", "restaurant reservation",
        "romantic dinner places", "rooftop dining", "seafood restaurants",
        "takeout and delivery", "vegan restaurants"
    ]
};
// 🔥 Fusion propre → l'analyse peut fonctionner correctement
exports.seoKeywords = Object.values(keywordGroups).flat();
