import React, { useEffect, useMemo, useRef, useState } from "react";
import worldSvg from "../assets/world-combined-clean.svg?raw";

import { getCountryLanguages, getCountryEntry } from "../data/getCountryLanguages";
import { getCountryMetaByISO2 } from "../data/getCountryMeta";
import { getIndigenousLanguagesLabel } from "../data/getIndigenousLabel";
import geoCountries from "../data/geo/countries.with.subdivisions.json";
type NexusSubdivision = {
  code: string;
  name: string;
};

type UiLang = {
  code?: string;
  nameNative: string;
  nameEnglish: string;
  isOfficial: boolean;
};

type GeoCountry = {
  iso2: string;
  name?: string;
  iso3?: string;
  subdivisions?: NexusSubdivision[];
};

type WorldMapProps = {
  onSelectCountry?: (iso2: string) => void;
};

function normalizeText(value: string | null | undefined): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeMapIdToISO2(id: string | null): string | null {
  if (!id) return null;

  const clean = id.toUpperCase();

  // ISO2 direct
  if (clean.length === 2) return clean;

  // Essai match ISO3 → ISO2
  const match = (geoCountries as any[]).find(
    (c) =>
      String(c.iso3 || "").toUpperCase() === clean ||
      String(c.iso2 || "").toUpperCase() === clean
  );

  if (match?.iso2) return match.iso2;

  // fallback
  return clean.slice(0, 2);
}

export default function WorldMap({ onSelectCountry }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [acceptedSubdivision, setAcceptedSubdivision] =
    useState<NexusSubdivision | null>(null);

  const iso2 = selectedId;

  const entry = useMemo(() => getCountryEntry(selectedId), [selectedId]);
  const meta = useMemo(() => getCountryMetaByISO2(iso2), [iso2]);
  const languages = useMemo(
    () => getCountryLanguages(selectedId) as UiLang[],
    [selectedId]
  );

  const official = useMemo(
    () => languages.filter((l) => l.isOfficial),
    [languages]
  );

  const others = useMemo(
    () => languages.filter((l) => !l.isOfficial),
    [languages]
  );

  const matchedIso2 = useMemo(() => {
    if (meta?.iso2) return String(meta.iso2).toUpperCase();
    if (iso2) return iso2;
    return null;
  }, [meta, iso2]);

  const geoCountry = useMemo(() => {
    const list = geoCountries as GeoCountry[];
    if (!Array.isArray(list) || !list.length) return null;

    const byIso2 = matchedIso2
      ? list.find(
          (country) =>
            String(country.iso2 || "").toUpperCase() === matchedIso2
        )
      : null;

    if (byIso2) return byIso2;

    const byIso3 = meta?.iso3
      ? list.find(
          (country) =>
            String(country.iso3 || "").toUpperCase() ===
            String(meta.iso3 || "").toUpperCase()
        )
      : null;

    if (byIso3) return byIso3;

    const entryName = normalizeText(entry?.countryName);
    if (entryName) {
      const byName = list.find(
        (country) => normalizeText(country.name) === entryName
      );
      if (byName) return byName;
    }

    return null;
  }, [matchedIso2, meta, entry]);

  const subdivisions = useMemo(() => {
    if (!geoCountry) return [];
    const list = Array.isArray(geoCountry?.subdivisions)
  ? geoCountry?.subdivisions ?? []
  : [];

  if (selectedId) {
  console.log("🌍 Selected:", selectedId);
  console.log("🏳️ Country:", geoCountry?.name);
  console.log("📍 Subdivisions:", list.length);
  console.log("🧩 Data:", list.slice(0, 3)); // preview
}

    return list;
  }, [geoCountry, selectedId]);

  const countryLabel = useMemo(() => {
    if (!selectedId) return "—";
    if (!entry) return "—";

    return `${entry.countryName}${
      entry.countryNativeName ? ` (${entry.countryNativeName})` : ""
    }`;
  }, [selectedId, entry]);

  const capitalLabel = useMemo(
    () => (selectedId ? meta?.capital ?? "—" : "—"),
    [selectedId, meta]
  );

  const currencyLabel = useMemo(() => {
    if (!selectedId) return "—";
    if (!meta?.currencyCode) return "—";

    return `${meta.currencySymbol ?? ""} (${meta.currencyCode})`.trim();
  }, [selectedId, meta]);

  const isoLine = useMemo(() => {
    if (!selectedId) return "—";
    if (!meta) return "—";

    return `ISO2: ${meta.iso2 ?? "—"} • ISO3: ${meta.iso3 ?? "—"} • Num: ${
      meta.numeric ?? "—"
    } • Domain: ${meta.domain ?? "—"}`;
  }, [selectedId, meta]);

  const indigenousLabel = useMemo(
    () => (selectedId ? getIndigenousLanguagesLabel(matchedIso2) : "—"),
    [selectedId, matchedIso2]
  );

  const officialLabel = useMemo(() => {
    if (!selectedId) return "—";
    if (!official.length) return "—";

    return official
      .map((l) => `${l.nameEnglish} (${l.nameNative})`)
      .join(", ");
  }, [selectedId, official]);

  const otherLabel = useMemo(() => {
    if (!selectedId) return "";
    if (!others.length) return "";

    return others
      .map((l) => `${l.nameEnglish} (${l.nameNative})`)
      .join(", ");
  }, [selectedId, others]);

  const subLanguageLabel = useMemo(() => {
    if (!selectedId) return "—";
    if (!otherLabel) return "—";
    return otherLabel;
  }, [selectedId, otherLabel]);

  const subdivisionSummary = useMemo(() => {
    if (!acceptedSubdivision) return "—";
    return `${acceptedSubdivision.name} (${acceptedSubdivision.code})`;
  }, [acceptedSubdivision]);

  const flagUrl = useMemo(
    () =>
      matchedIso2
        ? `https://flagcdn.com/w160/${matchedIso2.toLowerCase()}.png`
        : null,
    [matchedIso2]
  );

  const resolveDataId = (target: EventTarget | null): string | null => {
    if (!(target instanceof Element)) return null;
    const hit = target.closest("path[id], g[id], [data-id]");
    return (
      (hit?.getAttribute("data-id") || hit?.getAttribute("id") || "").trim() ||
      null
    );
  };

  const clearClass = (className: string) => {
    const svg = svgRef.current;
    if (!svg) return;

    svg
      .querySelectorAll<SVGElement>("." + className)
      .forEach((n) => n.classList.remove(className));
  };

  const applyClassById = (id: string | null, className: string) => {
    const svg = svgRef.current;
    if (!svg) return;

    clearClass(className);
    if (!id) return;

    const escaped = CSS.escape(id);
    const direct = Array.from(
      svg.querySelectorAll<SVGElement>(`[data-id="${id}"], #${escaped}`)
    );

    const targets: SVGElement[] = [];
    direct.forEach((el) => {
      targets.push(el);
      el.querySelectorAll<SVGPathElement>("path").forEach((p) => targets.push(p));
    });

    targets.forEach((n) => n.classList.add(className));
  };

  useEffect(() => {
    svgRef.current = containerRef.current?.querySelector("svg") ?? null;
    const svg = svgRef.current;
    if (!svg) return;

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 1000 600");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    paths.forEach((p) => {
      p.setAttribute("data-id", p.id || "");

      const hasInlineFill =
        p.getAttribute("fill") && p.getAttribute("fill") !== "none";
      const hasInlineStroke =
        p.getAttribute("stroke") && p.getAttribute("stroke") !== "none";

      if (!hasInlineFill) p.style.fill = "#1b1b1f";
      if (!hasInlineStroke) {
        p.style.stroke = "rgba(255,255,255,.20)";
        p.style.strokeWidth = "0.8";
      }
    });
  }, []);

  useEffect(() => {
    applyClassById(hoveredId, "is-hovered");
  }, [hoveredId]);

  useEffect(() => {
    applyClassById(selectedId, "is-selected");
  }, [selectedId]);

  useEffect(() => {
    setAcceptedSubdivision(null);
  }, [matchedIso2]);
useEffect(() => {
  console.log("🔄 Country changed → reset subdivision");
}, [matchedIso2]);
  const onPointerMove = (e: React.PointerEvent) => {
    const id = resolveDataId(e.target);
    setHoveredId((prev) => (prev === id ? prev : id));
  };

  const onPointerLeave = () => setHoveredId(null);

  const onClick = (e: React.MouseEvent) => {
    const id = resolveDataId(e.target);
    const iso = normalizeMapIdToISO2(id);

    if (!iso) return;

    setSelectedId(iso);
    onSelectCountry?.(iso);
  };

  const handleSubdivisionAccept = (item: NexusSubdivision | null) => {
    if (!item) return;
    setAcceptedSubdivision(item);
  };

  const handleSubdivisionDecline = () => {
    setAcceptedSubdivision(null);
  };

  return (
    <div className="noxel-shell">
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #000;
        }

        .noxel-shell {
          display: flex;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        .noxel-mapWrap {
          width: 70%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          background: radial-gradient(circle at center, #141414 0%, #080808 58%, #000 100%);
        }

        .noxel-mapWrap svg {
          width: 100%;
          height: 100%;
          display: block;
          max-width: 100%;
          max-height: 100%;
          transform-origin: 50% 50%;
          pointer-events: none;
        }

        .noxel-mapWrap svg path,
        .noxel-mapWrap svg g,
        .noxel-mapWrap svg [data-id] {
          pointer-events: auto;
          cursor: pointer;
          transition: filter .12s ease, opacity .12s ease;
        }

        .noxel-mapWrap svg .is-hovered {
          stroke: rgba(180, 120, 255, 1) !important;
          stroke-width: 1.8 !important;
          fill: hotpink !important;
          filter:
            drop-shadow(0 0 3px rgba(130, 90, 255, 0.95))
            drop-shadow(0 0 8px rgba(130, 90, 255, 0.70))
            drop-shadow(0 0 12px rgba(130, 90, 255, 0.45))
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.28));
          opacity: 1;
        }

        .noxel-mapWrap svg .is-selected {
          stroke: rgba(181, 229, 81, 0.95) !important;
          stroke-width: 2.2 !important;
          filter:
            drop-shadow(0 0 3px rgba(181, 229, 81, 1))
            drop-shadow(0 0 8px rgba(181, 229, 81, 0.75))
            drop-shadow(0 0 12px rgba(181, 229, 81, 0.45))
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.28));
          opacity: 1;
        }

        .noxel-mapWrap svg .is-selected.is-hovered {
          filter:
            drop-shadow(0 0 3px rgba(181, 229, 81, 1))
            drop-shadow(0 0 8px rgba(181, 229, 81, 0.75))
            drop-shadow(0 0 12px rgba(181, 229, 81, 0.45))
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.28));
          opacity: 1;
        }

        .noxel-panel {
          width: 30%;
          height: 100%;
          background: #000;
          color: #fff;
          padding: 22px 24px 28px;
          overflow-y: auto;
          overflow-x: hidden;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .noxel-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 2px 0;
          color: #fff;
          font-family: Georgia, serif;
        }

        .noxel-value {
          font-size: 24px;
          font-weight: 400;
          margin: 0 0 16px 0;
          color: #B5E551;
          word-break: break-word;
          font-family: Georgia, serif;
          line-height: 1.2;
        }

        .noxel-debug {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: baseline;
          margin-bottom: 16px;
        }

        .noxel-panelHeader {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 14px;
        }

        .noxel-flag {
          width: 160px;
          height: auto;
          display: block;
        }

        .noxel-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 24px;
          flex: 1;
        }

        .noxel-subSummaryTitle {
          font-size: 20px;
          color: #fff;
          margin-bottom: 6px;
          font-family: Arial, sans-serif;
        }

        .noxel-subSummaryValue {
          font-size: 22px;
          color: #B5E551;
          font-family: Georgia, serif;
        }

        .noxel-smallDebug {
          font-size: 13px;
          color: #8e8e8e;
          font-family: Arial, sans-serif;
          margin-top: 6px;
        }
      `}</style>

      <div
        ref={containerRef}
        className="noxel-mapWrap"
        dangerouslySetInnerHTML={{ __html: worldSvg }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
      />

      <div className="noxel-panel">
        <div className="noxel-debug">
          <h2 className="noxel-title">Hover:</h2>
          <h2 className="noxel-value">{hoveredId ?? "—"}</h2>

          <h2 className="noxel-title">Selected:</h2>
          <h2 className="noxel-value">{selectedId ?? "—"}</h2>
        </div>

        <div className="noxel-panelHeader">
          {flagUrl && (
            <img
              className="noxel-flag"
              src={flagUrl}
              alt="Flag"
              loading="lazy"
            />
          )}

          <div>
            <h2 className="noxel-title">Country:</h2>
            <h2 className="noxel-value">{countryLabel}</h2>
          </div>
        </div>

        <ul className="noxel-list">
          <li>
            <h2 className="noxel-title">Informations</h2>
          </li>

          <li>
            <h2 className="noxel-title">Capital City:</h2>
            <h2 className="noxel-value">{capitalLabel}</h2>

            {selectedId && (
              <>
                

                <div className="noxel-smallDebug">
                  map id: {selectedId ?? "—"} | matched iso2: {matchedIso2 ?? "—"} | subdivisions: {subdivisions.length}
                </div>

                <div style={{ marginTop: 14 }}>
                  <div className="noxel-subSummaryTitle">
                    Accepted subdivision
                  </div>
                  <div className="noxel-subSummaryValue">
                    {subdivisionSummary}
                  </div>
                </div>
              </>
            )}
          </li>

          <li>
            <h2 className="noxel-title">Official Languages:</h2>
            <h2 className="noxel-value">{officialLabel}</h2>
          </li>

          <li>
            <h2 className="noxel-title">Sub Language</h2>
            <h2 className="noxel-value">{subLanguageLabel}</h2>
          </li>

          <li>
            <h2 className="noxel-title">Indigenous Languages:</h2>
            <h2 className="noxel-value">{indigenousLabel}</h2>
          </li>

          <li>
            <h2 className="noxel-title">Currency:</h2>
            <h2 className="noxel-value">{currencyLabel}</h2>
          </li>

          <li>
            <h2 className="noxel-title">ISO Codes & Symbols:</h2>
            <h2 className="noxel-value">{isoLine}</h2>
          </li>
        </ul>
      </div>
    </div>
  );
}





