import modulesIndex from "../../modules/index.json";
export function useModulesIndex() {
    const data = modulesIndex;
    const list = Array.isArray(data) ? data : (data.modules ?? []);
    return list.map((m) => ({
        ...m,
        key: String(m.key),
        name: String(m.name),
        route: String(m.route),
        landingFile: String(m.landingFile),
        promise: m.promise ? String(m.promise) : "",
        status: m.status ?? "missing",
    }));
}
