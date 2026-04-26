export const MODULES = [
    { id: "maestro", name: "NOXEL MAESTRO", route: "/app/maestro", minTier: "bronze", kind: "internal", status: "active" },
    { id: "atlas", name: "NOXEL ATLAS", route: "/app/atlas", minTier: "bronze", kind: "internal", status: "placeholder" },
    { id: "seo", name: "NOXEL SEO", route: "/app/seo", minTier: "bronze", kind: "internal", status: "placeholder" },
    { id: "serp", name: "NOXEL SERP", route: "/app/serp", minTier: "argent", kind: "internal", status: "placeholder" },
    { id: "vitals", name: "NOXEL VITALS", route: "/app/vitals", minTier: "bronze", kind: "internal", status: "placeholder" },
    // ✅ renommage conseillé : au lieu de "webp" → "optima"
    { id: "optima", name: "NOXEL OPTIMA", route: "/app/optima", minTier: "bronze", kind: "internal", status: "placeholder" },
    // placeholders futurs
    { id: "links", name: "NOXEL LINKS", route: "/app/links", minTier: "bronze", kind: "internal", status: "placeholder" },
    { id: "crm", name: "NOXEL CRM", route: "/app/crm", minTier: "bronze", kind: "internal", status: "placeholder" },
    { id: "analytics", name: "NOXEL ANALYTICS", route: "/app/analytics", minTier: "bronze", kind: "internal", status: "placeholder" },
    { id: "morph", name: "NOXEL MORPH™", route: "/app/morph", minTier: "diamant", kind: "internal", status: "placeholder" },
];
// ✅ SAFE: accepte params inconnus (URL), évite l'erreur TS
export const getModule = (id) => {
    if (typeof id !== "string")
        return undefined;
    return MODULES.find((m) => m.id === id);
};
