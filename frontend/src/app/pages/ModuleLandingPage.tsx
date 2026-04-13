import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useModulesIndex } from "../modules/useModulesIndex";
import { landingRegistry } from "./landingRegistry";
import { LOGO_BY_ID } from "@/app/modules/logos";

type SectionKind =
  | "normal"
  | "why"
  | "capabilities"
  | "connections"
  | "reserved";

type SectionCard = {
  title: string;
  lines: string[];
  kind: SectionKind;
  priority: number;
};

function cleanLine(line: string): string {
  return String(line)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\>\s*/, "")
    .trim();
}

function detectKind(title: string): SectionKind {
  const t = title.toLowerCase();

  if (t.includes("why this module exists")) return "why";
  if (t.includes("module capabilities")) return "capabilities";
  if (t.includes("connections")) return "connections";
  if (t.includes("module space") || t.includes("reserved")) return "reserved";
  return "normal";
}

function sectionPriority(kind: SectionKind): number {
  if (kind === "why") return 1;
  if (kind === "capabilities") return 2;
  if (kind === "connections") return 3;
  if (kind === "normal") return 4;
  return 5;
}

function parseLanding(md: string): {
  heroTitle: string;
  promise: string;
  cards: SectionCard[];
} {
  const text = String(md || "").replace(/\r/g, "");
  const lines = text.split("\n");

  let heroTitle = "";
  let promise = "";

  const cards: SectionCard[] = [];
  let currentTitle = "";
  let currentLines: string[] = [];

  const pushCard = () => {
    if (!currentTitle && currentLines.length === 0) return;

    const kind = detectKind(currentTitle || "Overview");

    cards.push({
      title: currentTitle || "Overview",
      lines: [...currentLines],
      kind,
      priority: sectionPriority(kind),
    });

    currentTitle = "";
    currentLines = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("# ")) {
      heroTitle = cleanLine(line.replace(/^#\s+/, ""));
      continue;
    }

    if (line.startsWith("**Promise:**")) {
      promise = cleanLine(line.replace(/^\*\*Promise:\*\*\s*/, ""));
      continue;
    }

    if (line.startsWith("## ")) {
      pushCard();
      currentTitle = cleanLine(line.replace(/^##\s+/, ""));
      continue;
    }

    if (line.startsWith("### ")) {
      currentLines.push(`@@SUB@@ ${cleanLine(line.replace(/^###\s+/, ""))}`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      currentLines.push(`• ${cleanLine(line.replace(/^\d+\.\s+/, ""))}`);
      continue;
    }

    if (/^\-\s+/.test(line)) {
      currentLines.push(`• ${cleanLine(line.replace(/^\-\s+/, ""))}`);
      continue;
    }

    currentLines.push(cleanLine(line));
  }

  pushCard();

  cards.sort((a, b) => a.priority - b.priority);

  return {
    heroTitle: heroTitle || "NOXEL MODULE",
    promise: promise || "Landing scaffold (details coming soon).",
    cards,
  };
}

function displayTitle(raw: string): string {
  return raw.replace(/^\d+\)\s*/, "").trim();
}

function sectionIcon(kind: SectionKind): string {
  if (kind === "why") return "◎";
  if (kind === "capabilities") return "◆";
  if (kind === "connections") return "↔";
  if (kind === "reserved") return "◌";
  return "•";
}

export function ModuleLandingPage() {
  const { moduleId } = useParams<{ moduleId?: string }>();
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
  const parsed = useMemo(() => parseLanding(md), [md]);

  if (!moduleItem) {
    return (
      <div className="nx-landing-page">
        <header className="nx-landing-hero">
          <div className="nx-landing-hero__content">
            <div className="nx-kicker">NOXEL360</div>
            <h1 className="nx-landing-title">Module not found</h1>
            <p className="nx-landing-lead">
              This route is not mapped to an active NOXEL module yet.
            </p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="nx-landing-page">
      <header className="nx-landing-hero">
        <div className="nx-landing-hero__media">
          <img
            src={logoSrc}
            alt={moduleItem.name}
            className="module-landing-logo"
            loading="lazy"
          />
        </div>

        <div className="nx-landing-hero__content">
          <div className="nx-kicker">NOXEL360</div>
          <h1 className="nx-landing-title">
            {parsed.heroTitle || moduleItem.name}
          </h1>
          <p className="nx-landing-lead">
            {moduleItem.promise || parsed.promise}
          </p>

          <div className="nx-landing-meta">
            <span className="nx-pill nx-pill--intel">
              {moduleItem.key.toUpperCase()}
            </span>
            <span className="nx-pill">
              {moduleItem.status.toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      <section className="nx-landing-grid" aria-label="Module overview">
        {parsed.cards.map((card, index) => (
          <article
            key={`${card.title}-${index}`}
            className={[
              "nx-landing-card",
              card.kind === "why" ? "nx-landing-card--why" : "",
              card.kind === "capabilities" ? "nx-landing-card--capabilities" : "",
              card.kind === "connections" ? "nx-landing-card--connections" : "",
              card.kind === "reserved" ? "nx-landing-card--reserved" : "",
            ].join(" ")}
          >
            <div className="nx-landing-card__head">
              <span className="nx-landing-card__icon">{sectionIcon(card.kind)}</span>
              <h2 className="nx-landing-card__title">
                {displayTitle(card.title)}
              </h2>
            </div>

            <div className="nx-landing-card__body">
              {card.lines.map((line, lineIndex) => {
                if (line.startsWith("@@SUB@@ ")) {
                  return (
                    <div key={lineIndex} className="nx-landing-minihead">
                      {line.replace("@@SUB@@ ", "")}
                    </div>
                  );
                }

                if (line.startsWith("• ")) {
                  return (
                    <div key={lineIndex} className="nx-landing-bullet">
                      {line}
                    </div>
                  );
                }

                return (
                  <p key={lineIndex} className="nx-landing-paragraph">
                    {line}
                  </p>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
