import modulesIndex from "../../modules/index.json";

export type ModuleIndexItem = {
  key: string;
  name: string;
  route: string;
  landingFile: string;
  promise?: string;
  status?: "ready" | "missing";
};

export function useModulesIndex(): ModuleIndexItem[] {
  const data: any = modulesIndex as any;
  const list = Array.isArray(data) ? data : (data.modules ?? []);
  return (list as ModuleIndexItem[]).map((m) => ({
    ...m,
    key: String(m.key),
    name: String(m.name),
    route: String(m.route),
    landingFile: String(m.landingFile),
    promise: m.promise ? String(m.promise) : "",
    status: m.status ?? "missing",
  }));
}
