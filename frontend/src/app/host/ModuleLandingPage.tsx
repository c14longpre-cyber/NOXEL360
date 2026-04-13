import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useModulesIndex } from "../modules/useModulesIndex";
import { landingRegistry } from "./landingRegistry";
import { LOGO_BY_ID } from "@/app/modules/logos";

export function ModuleLandingPage() {
  const { moduleId } = useParams();
  const loc = useLocation();
  const modules = useModulesIndex();

  const moduleItem = useMemo(() => {
    const key = String(moduleId ?? "").toLowerCase().trim();
    const path = String(loc.pathname ?? "").toLowerCase().trim();

    return (
      modules.find((x) => {
        const k = String(x.key ?? "").toLowerCase().trim();
        const r = String(x.route ?? "").toLowerCase().trim();
        return (key && k === key) || (r && r === path);
      }) ?? null
    );
  }, [moduleId, loc.pathname, modules]);

  const moduleKey = String(moduleItem?.key ?? moduleId ?? "").toLowerCase().trim();
  const md = landingRegistry[moduleKey] ?? "";
  const logoSrc = LOGO_BY_ID[moduleKey] || LOGO_BY_ID["360"] || "";

  if (!moduleItem) {
    return (
      <div className="nx-landing-page">
        <h1>Module not found</h1>
      </div>
    );
  }

  return (
    <div className="nx-landing-page">
      <header className="nx-landing-hero">
        <img src={logoSrc} alt="" style={{ width: 160 }} />
        <div>
          <h1>{moduleItem.name}</h1>
          <p>{moduleItem.promise}</p>
        </div>
      </header>

      <section className="nx-landing-grid">
        <div className="nx-card">
          <pre>{md}</pre>
        </div>
      </section>
    </div>
  );
}
