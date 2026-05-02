import { useEffect, useMemo, useRef, useState } from "react";
import worldSvgRaw from "./world-combined-clean.svg?raw";
import { COUNTRY_DATA, type CountryInfo } from "./countryData";
import { getCountryMetaByISO2 } from "./getCountryMeta";
import { resolveBestLanguage } from "./resolveLanguage";
import { useI18n } from "../../useI18n";
import type { AppLanguage } from "../../language/LanguageStore";

type CountryRow = {
  iso2: string;
  name: string;
  iso3?: string;
  isoNumeric?: string;
  capital?: string;
  currency?: string;
  domain?: string;
  region?: string;
  subregion?: string;
  flag?: string;
  officialLanguages?: string[];
  indigenousLanguages?: string[];
};

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  iso: string | null;
};

type Props = {
  currentLanguage: AppLanguage;
  onSelectLanguage: (code: AppLanguage) => void;
};

const LANGUAGE_BY_ISO2: Partial<Record<string, AppLanguage>> = {
  US: "en",
  CA: "en",
  GB: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
  SE: "sv",
  NO: "no",
  DK: "da",
  FI: "fi",
  IS: "sv",
  PL: "pl",
  CZ: "cs",
  SK: "cs",
  HU: "hu",
  RO: "ro",
  BG: "ro",
  GR: "el",
  UA: "uk",
  RS: "en",
  HR: "en",
  SI: "en",
  BA: "en",
  MK: "en",
  AL: "en",
  LT: "en",
  LV: "en",
  EE: "en",
  IN: "hi",
  PK: "en",
  BD: "bn",
  ID: "id",
  TH: "th",
  VN: "vi",
  PH: "en",
  KR: "ko",
  MY: "ms",
  ZA: "en",
  NG: "en",
  KE: "en",
  GH: "en",
  TZ: "en",
  UG: "en",
  ET: "en",
  RU: "ru",
  KZ: "ru",
  UZ: "ru",
  TM: "ru",
  KG: "ru",
  TJ: "ru",
  IR: "fa",
  IL: "he",
  TR: "tr",
  AF: "fa",
  NP: "en",
  LK: "en",
  FR: "fr",
  BE: "fr",
  CH: "fr",
  LU: "fr",
  MC: "fr",
  SN: "fr",
  CI: "fr",
  CM: "fr",
  CD: "fr",
  CG: "fr",
  GA: "fr",
  TG: "fr",
  BJ: "fr",
  ML: "fr",
  NE: "fr",
  BF: "fr",
  RW: "fr",
  BI: "fr",
  CF: "fr",
  TD: "fr",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  UY: "es",
  PY: "es",
  BO: "es",
  EC: "es",
  CR: "es",
  PA: "es",
  DO: "es",
  GT: "es",
  HN: "es",
  NI: "es",
  SV: "es",
  DE: "de",
  AT: "de",
  IT: "it",
  PT: "pt",
  BR: "pt",
  AO: "pt",
  MZ: "pt",
  NL: "nl",
  JP: "ja",
  CN: "zh",
  TW: "zh",
  SG: "zh",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  DZ: "ar",
  MA: "ar",
  SD: "ar",
  IQ: "ar",
  JO: "ar",
  KW: "ar",
  LB: "ar",
  LY: "ar",
  OM: "ar",
  QA: "ar",
  SY: "ar",
  TN: "ar",
  YE: "ar",
};

function normalizeIso(raw?: string | null): string | null {
  if (!raw) return null;
  const clean = raw.trim().toLowerCase().replace(/^_+/, "");
  if (!/^[a-z]{2,3}$/.test(clean)) return null;
  return clean.toUpperCase();
}

function findIsoFromElement(el: Element | null): string | null {
  let node: Element | null = el;

  while (node) {
    const iso =
      normalizeIso(node.getAttribute("data-country-iso")) ||
      normalizeIso(node.getAttribute("data-iso")) ||
      normalizeIso(node.getAttribute("data-iso2")) ||
      normalizeIso(node.id);

    if (iso) return iso;
    node = node.parentElement;
  }

  return null;
}

export default function NexusLanguageMap({
  currentLanguage,
  onSelectLanguage,
}: Props) {
  const { t } = useI18n();

  const [selectedIso, setSelectedIso] = useState<string>("CA");
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    iso: null,
  });

  const mapHostRef = useRef<HTMLDivElement | null>(null);

  const countryByIso2 = useMemo<Map<string, CountryRow>>(() => {
    const map = new Map<string, CountryRow>();

    Object.values(COUNTRY_DATA).forEach((row: CountryInfo) => {
      if (!row.iso2) return;

      map.set(row.iso2.toUpperCase(), {
        iso2: row.iso2,
        name: row.name,
        iso3: row.iso3,
        isoNumeric: row.isoNumeric,
        capital: row.capital,
        currency: row.currency,
        domain: row.domain,
        region: row.region,
        subregion: row.subregion,
        flag: row.flag,
        officialLanguages: row.officialLanguages,
        indigenousLanguages: row.indigenousLanguages,
      });
    });

    return map;
  }, []);

  const selectedCountry = countryByIso2.get(selectedIso) || null;
  const selectedMeta = getCountryMetaByISO2(selectedIso);
  const hoveredCountry = tooltip.iso ? countryByIso2.get(tooltip.iso) || null : null;

  useEffect(() => {
    const host = mapHostRef.current;
    if (!host) return;

    const svg = host.querySelector("svg");
    const countriesGroup = host.querySelector("#countries");

    if (!svg || !countriesGroup) return;

    const countryNodes = Array.from(
      countriesGroup.querySelectorAll<SVGElement>(
        "g, path, polygon, circle, ellipse, rect, use"
      )
    );

    for (const node of countryNodes) {
      const iso = findIsoFromElement(node);

      if (iso) {
        node.setAttribute("data-country-iso", iso);
        node.style.cursor = "pointer";
        node.style.pointerEvents = "auto";
      }
    }

    const paintables = Array.from(
      countriesGroup.querySelectorAll<SVGElement>("[data-country-iso]")
    );

    for (const node of paintables) {
      const iso = node.getAttribute("data-country-iso");
      if (!iso) continue;

      const isSelected = iso === selectedIso;
      const isHovered = iso === hoveredIso;

      node.style.transition =
        "fill 0.18s ease, opacity 0.18s ease, stroke 0.18s ease, filter 0.18s ease";
      node.style.pointerEvents = "auto";

      if (isSelected) {
        node.style.fill = "#3CDE6A";
        node.style.stroke = "#702AA5";
        node.style.strokeWidth = "1.2";
        node.style.opacity = "1";
        node.style.filter = "drop-shadow(0 0 4px rgba(60,222,106,0.55))";
      } else if (isHovered) {
        node.style.fill = "#8ae7a8";
        node.style.stroke = "#702AA5";
        node.style.strokeWidth = "0.9";
        node.style.opacity = "1";
        node.style.filter = "drop-shadow(0 0 3px rgba(138,231,168,0.45))";
      } else {
        node.style.fill = "#9BD5C1";
        node.style.stroke = "#0477BE";
        node.style.strokeWidth = "0.5";
        node.style.opacity = "0.95";
        node.style.filter = "none";
      }
    }
  }, [selectedIso, hoveredIso]);

  function resolveAndApplyLanguage(countryIso: string) {
    const resolved = resolveBestLanguage(
      countryIso,
      undefined,
      navigator.languages,
      LANGUAGE_BY_ISO2[countryIso] || "en"
    );

    const finalLanguage = (resolved ||
      LANGUAGE_BY_ISO2[countryIso] ||
      "en") as AppLanguage;

    onSelectLanguage(finalLanguage);
  }

  function handleSvgClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as Element | null;
    const iso = findIsoFromElement(target);
    if (!iso) return;

    setSelectedIso(iso);
  }

  function handleSvgMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as Element | null;
    const iso = findIsoFromElement(target);

    setHoveredIso(iso);

    if (!iso || !mapHostRef.current) {
      setTooltip((prev) => ({ ...prev, visible: false, iso: null }));
      return;
    }

    const rect = mapHostRef.current.getBoundingClientRect();

    setTooltip({
      visible: true,
      x: event.clientX - rect.left + 12,
      y: event.clientY - rect.top + 12,
      iso,
    });
  }

  function handleSvgMouseLeave() {
    setHoveredIso(null);
    setTooltip((prev) => ({ ...prev, visible: false, iso: null }));
  }

  function applySelectedCountryLanguage() {
    resolveAndApplyLanguage(selectedIso);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.65fr)",
        gap: 16,
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
          overflow: "hidden",
          minHeight: 420,
          padding: 8,
        }}
      >
        <div
          ref={mapHostRef}
          onClick={handleSvgClick}
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={handleSvgMouseLeave}
          dangerouslySetInnerHTML={{ __html: worldSvgRaw }}
        />

        {tooltip.visible && tooltip.iso && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y,
              zIndex: 20,
              pointerEvents: "none",
              background: "rgba(10,12,18,0.94)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 12,
              padding: "8px 10px",
              fontSize: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              maxWidth: 220,
            }}
          >
            <div style={{ fontWeight: 700 }}>
              {hoveredCountry?.name || tooltip.iso}
            </div>
            <div style={{ opacity: 0.75 }}>{tooltip.iso}</div>
          </div>
        )}
      </div>

      <aside
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
          padding: 16,
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 12,
            opacity: 0.72,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {t("language.selector.title")}
        </div>

        <h3 style={{ margin: "8px 0 12px", fontSize: 22 }}>
          {selectedCountry?.name || selectedMeta?.iso2 || t("language.selector.selectCountry")}
        </h3>

        {selectedCountry?.flag ? (
          <img
            src={selectedCountry.flag}
            alt={selectedCountry.name}
            style={{
              width: 56,
              height: 38,
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: 12,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
        ) : null}

        <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
          <div><strong>ISO2:</strong> {selectedIso || "—"}</div>
          <div><strong>ISO3:</strong> {selectedCountry?.iso3 || selectedMeta?.iso3 || "—"}</div>
          <div><strong>{t("language.selector.capital")}:</strong> {selectedCountry?.capital || selectedMeta?.capital || "—"}</div>
          <div><strong>{t("language.selector.region")}:</strong> {selectedCountry?.region || "—"}</div>
          <div><strong>{t("language.selector.subregion")}:</strong> {selectedCountry?.subregion || "—"}</div>
          <div><strong>{t("language.selector.domain")}:</strong> {selectedCountry?.domain || selectedMeta?.domain || "—"}</div>
          <div><strong>{t("language.selector.currency")}:</strong> {selectedCountry?.currency || selectedMeta?.currencyCode || "—"}</div>
          <div>
            <strong>{t("language.selector.officialLanguages")}:</strong>{" "}
            {selectedCountry?.officialLanguages?.join(", ") || "—"}
          </div>
          <div>
            <strong>{t("language.selector.indigenousLanguages")}:</strong>{" "}
            {selectedCountry?.indigenousLanguages?.join(", ") || "—"}
          </div>
          <div>
            <strong>{t("language.selector.mappedLanguage")}:</strong>{" "}
            {LANGUAGE_BY_ISO2[selectedIso] || "not mapped yet"}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={applySelectedCountryLanguage}
            style={{
              borderRadius: 999,
              padding: "10px 14px",
              border: "1px solid rgba(60,222,106,0.9)",
              background: "rgba(60,222,106,0.14)",
              color: "white",
              cursor: "pointer",
            }}
          >
            {t("language.selector.apply")}
          </button>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, opacity: 0.65 }}>
          {t("language.selector.current")}: {currentLanguage.toUpperCase()}
        </p>
      </aside>
    </div>
  );
}

