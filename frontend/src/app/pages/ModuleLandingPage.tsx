import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useModulesIndex } from "../modules/useModulesIndex";
import { landingRegistry } from "./landingRegistry";
import { LOGO_BY_ID } from "@/app/modules/logos";
import { useI18n } from "@/useI18n";

type LandingSection = {
  title: string;
  body: string[];
  kind: "standard" | "capabilities" | "connections" | "reserved";
};

function getSectionKind(title: string): LandingSection["kind"] {
  const t = title.toLowerCase();

  if (t.includes("module capabilities")) return "capabilities";
  if (t.includes("connections")) return "connections";
  if (t.includes("module space") || t.includes("reserved")) return "reserved";

  return "standard";
}

function parseLandingMarkdown(md: string): {
  heroTitle: string;
  heroText: string;
  sections: LandingSection[];
} {
  const raw = String(md || "").replace(/\r/g, "");
  const lines = raw.split("\n");

  let heroTitle = "";
  let heroText = "";
  const sections: LandingSection[] = [];

  let currentTitle = "";
  let currentBody: string[] = [];

  const flush = () => {
    if (!currentTitle && currentBody.length === 0) return;

    sections.push({
      title: currentTitle || "Overview",
      body: [...currentBody],
      kind: getSectionKind(currentTitle || "Overview"),
    });

    currentTitle = "";
    currentBody = [];
  };

  for (const originalLine of lines) {
    const line = originalLine.trim();

    if (!line) continue;

    if (line.startsWith("# ")) {
      heroTitle = line.replace(/^#\s+/, "").trim();
      continue;
    }

    if (line.startsWith("**Promise:**")) {
      heroText = line.replace(/^\*\*Promise:\*\*\s*/, "").trim();
      continue;
    }

    if (line.startsWith("## ")) {
      flush();
      currentTitle = line.replace(/^##\s+/, "").trim();
      continue;
    }

    if (line.startsWith("### ")) {
      currentBody.push(line.replace(/^###\s+/, "").trim());
      continue;
    }

    currentBody.push(line);
  }

  flush();

  if (!heroTitle) heroTitle = "NOXEL Module";
  if (!heroText) heroText = "Landing scaffold (details coming soon).";

  return { heroTitle, heroText, sections };
}

function normalizeBodyLine(line: string): string {
  return line
    .replace(/^\-\s+/, "• ")
    .replace(/^\d+\.\s+/, "• ")
    .replace(/^>\s+/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .trim();
}

function formatSectionTitle(title: string): string {
  return title.replace(/^\d+\)\s*/, "").trim();
}

export function ModuleLandingPage() {
  const { moduleId } = useParams<{ moduleId?: string }>();
  const loc = useLocation();
  const modules = useModulesIndex();
  const { t } = useI18n();

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

  if (!moduleItem) {
    return (
      <div className="nx-landing-page">
        <div className="nx-landing-hero">
          <div className="nx-landing-hero__content">
            <div className="nx-kicker">NOXEL360</div>
            <h1 className="nx-landing-title">{t("module.notFound")}</h1>
            <p className="nx-landing-lead">
              {t("module.notFound.subtitle")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const moduleKey = String(moduleItem.key ?? moduleId ?? "").toLowerCase().trim();
  const md = landingRegistry[moduleKey] ?? "";
  const logoSrc = LOGO_BY_ID[moduleKey] || LOGO_BY_ID["360"] || "";
  const parsed = useMemo(() => parseLandingMarkdown(md), [md]);

  return (
    <div className="nx-landing-page">
      <header className="nx-landing-hero">
        <div className="nx-landing-hero__media">
          <img
            src={logoSrc}
            alt={String(moduleItem.key).toUpperCase()}
            className="module-landing-logo"
            loading="lazy"
          />
        </div>

        <div className="nx-landing-hero__content">
          <div className="nx-kicker">NOXEL360</div>

          <h1 className="nx-landing-title">
            {parsed.heroTitle || String(moduleItem.key).toUpperCase()}
          </h1>

          <p className="nx-landing-lead">
            {(moduleItem as any).promise ||
              parsed.heroText ||
              t("module.landing.scaffold")}
          </p>

          <div className="nx-landing-meta">
            <span className="nx-pill nx-pill--intel">
              {moduleItem.key.toUpperCase()}
            </span>
            <span className="nx-pill">{moduleItem.status.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <section className="nx-landing-grid" aria-label="Module overview">
        {parsed.sections.map((section, index) => {
          const cardClass = [
            "nx-landing-card",
            section.kind === "capabilities" ? "nx-landing-card--capabilities" : "",
            section.kind === "reserved" ? "nx-landing-card--wide" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <article
              key={`${section.title}-${index}`}
              className={cardClass}
            >
              <h2 className="nx-landing-card__title">
                {formatSectionTitle(section.title)}
              </h2>

              <div className="nx-landing-card__body">
                {section.body.map((line, lineIndex) => {
                  const clean = normalizeBodyLine(line);

                  if (!clean) return null;

                  const isBullet = clean.startsWith("• ");
                  const isSubheading =
                    !isBullet &&
                    !clean.endsWith(".") &&
                    clean.length < 60 &&
                    !clean.includes(":");

                  if (isSubheading) {
                    return (
                      <div key={lineIndex} className="nx-landing-minihead">
                        {clean}
                      </div>
                    );
                  }

                  if (isBullet) {
                    return (
                      <div key={lineIndex} className="nx-landing-bullet">
                        {clean}
                      </div>
                    );
                  }

                  return (
                    <p key={lineIndex} className="nx-landing-paragraph">
                      {clean}
                    </p>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}




