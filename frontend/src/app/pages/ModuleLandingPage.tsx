import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import modulesIndex from "../../modules/index.json";
import { landingRegistry } from "./landingRegistry";
import { LOGO_BY_ID } from "@/app/modules/logos";

export function ModuleLandingPage() {
  const { moduleId } = useParams<{ moduleId?: string }>();
  const loc = useLocation();

  const moduleItem = useMemo(() => {
    const key = String(moduleId ?? "").toLowerCase().trim();
    const path = String(loc.pathname ?? "").toLowerCase().trim();

    const list = (modulesIndex as any)?.modules as any[] | undefined;
    if (!Array.isArray(list)) return null;

    return (
      list.find((x) => {
        const k = String(x?.key ?? "").toLowerCase().trim();
        const r = String(x?.route ?? "").toLowerCase().trim();
        return (key && k === key) || (r && r === path);
      }) ?? null
    );
  }, [moduleId, loc.pathname]);

  if (!moduleItem) return <div style={{ padding: 24 }}>Module not found.</div>;

  const moduleKey = String(moduleItem.key ?? moduleId ?? "").toLowerCase().trim();
  const md = landingRegistry[moduleKey] ?? "";

  // ✅ Option B: logos live in src/assets and are imported via LOGO_BY_ID
  const logoSrc = LOGO_BY_ID[moduleKey] || LOGO_BY_ID["360"] || "";

  return (
    <div style={{ padding: 2, maxWidth: 980 }}>
      <header style={{ marginBottom: 14 }}>
        <div style={{ marginBottom: 14 }}>
          <img
            src={logoSrc}
            alt={moduleItem.name}
            className="module-landing-logo"
            loading="lazy"
          />
        </div>

        <h1>{moduleItem.name}</h1>

        {moduleItem.promise && (
          <p style={{ marginTop: 12, opacity: 0.85 }}>{moduleItem.promise}</p>
        )}
      </header>

      <section style={{ marginBottom: 24 }}>
        <pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
          {md || "Landing content missing."}
        </pre>
      </section>

      <section aria-label="Module Space">
        <h2 style={{ marginTop: 0 }}>Module Space</h2>
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: "1px dashed currentColor",
          }}
        >
          <p style={{ margin: 0 }}>
            The <strong>{moduleItem.name}</strong> module will be activated here.
          </p>
        </div>
      </section>
    </div>
  );
}
