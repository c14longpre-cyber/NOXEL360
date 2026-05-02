import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, type AppLanguage } from "../language/LanguageStore";
import { useI18n } from "../useI18n";
import NexusLanguageMap from "../language/nexus/NexusLanguageMap";
import { ALL_COUNTRIES, type CountryInfo } from "../language/nexus/countryData";
import { INDIGENOUS_BY_ISO2 } from "../language/nexus/indigenous";
import {
  LANGUAGE_CATALOG,
  getLanguageOption,
  hasFullTranslation,
} from "../i18n/languageCatalog";
import type { LanguageOption } from "../i18n/types";
import TranslationStatusBanner from "../components/TranslationStatusBanner";

/**
 * NexusPage — Page complète de sélection langue / pays.
 *
 * Nouveautés majeures :
 *   - Section "Indigenous languages" dédiée et cliquable pour CHAQUE pays
 *     qui en a (via `INDIGENOUS_BY_ISO2`). Le respect commence par la
 *     visibilité : les langues autochtones ne sont PAS reléguées en
 *     sous-catégorie, elles ont leur propre bloc avec endonymes natifs.
 *   - Badge "Translation in progress" quand la langue choisie n'a pas
 *     encore de dictionnaire UI (fallback silencieux sur l'anglais +
 *     bannière invitant à contribuer).
 *   - Support de 230+ langues (184 ISO 639-1 + ~60 autochtones).
 */

const REGION_FILTERS: { id: string; labelKey: string; fallback: string }[] = [
  { id: "all", labelKey: "nexus.filter.all", fallback: "All" },
  { id: "Americas", labelKey: "nexus.filter.americas", fallback: "Americas" },
  { id: "Europe", labelKey: "nexus.filter.europe", fallback: "Europe" },
  { id: "Asia", labelKey: "nexus.filter.asia", fallback: "Asia" },
  { id: "Africa", labelKey: "nexus.filter.africa", fallback: "Africa" },
  { id: "Oceania", labelKey: "nexus.filter.oceania", fallback: "Oceania" },
];

const ISO_LANG_TO_APP: Partial<Record<string, AppLanguage>> = {};
for (const lang of LANGUAGE_CATALOG) {
  ISO_LANG_TO_APP[lang.code] = lang.code;
}

function languageNameToCode(name: string): AppLanguage | null {
  if (!name) return null;
  const n = name.toLowerCase().trim();

  for (const lang of LANGUAGE_CATALOG) {
    if (lang.label.toLowerCase() === n) return lang.code;
    if (lang.nativeLabel.toLowerCase() === n) return lang.code;
  }

  // Quelques alias fréquents pour les noms longs
  if (n.includes("english")) return "en";
  if (n.includes("french") || n.includes("français")) return "fr";
  if (n.includes("spanish") || n.includes("castilian") || n.includes("español")) return "es";
  if (n.includes("german") || n.includes("deutsch")) return "de";
  if (n.includes("italian") || n.includes("italiano")) return "it";
  if (n.includes("portuguese") || n.includes("português")) return "pt";
  if (n.includes("chinese") || n.includes("mandarin")) return "zh";
  if (n.includes("japanese")) return "ja";
  if (n.includes("korean")) return "ko";
  if (n.includes("arabic")) return "ar";
  if (n.includes("russian")) return "ru";
  if (n.includes("hindi")) return "hi";

  return null;
}

type LangChoice = {
  code: AppLanguage;
  label: string;
  nativeLabel?: string;
  option: LanguageOption | null;
  indigenous: boolean;
  /** Nom du peuple / nation qui parle cette langue (affiché en sous-titre) */
  nation?: string;
};

export default function NexusPage() {
  const { t } = useI18n();
  const { language, setLanguage, currentLanguage } = useLanguage();
  const nav = useNavigate();

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [selectedIso, setSelectedIso] = useState<string>("CA");

  const filteredCountries = useMemo<CountryInfo[]>(() => {
    const q = query.trim().toLowerCase();
    return ALL_COUNTRIES.filter((c) => {
      if (region !== "all" && c.region !== region) return false;
      if (!q) return true;
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.iso2.toLowerCase().includes(q)) return true;
      if (c.iso3?.toLowerCase().includes(q)) return true;
      if (c.capital?.toLowerCase().includes(q)) return true;
      if (c.languages?.some((l) =>
        (l.name + " " + (l.nativeName || "")).toLowerCase().includes(q)
      )) return true;
      return false;
    });
  }, [query, region]);

  const selectedCountry = useMemo<CountryInfo | null>(() => {
    return (
      ALL_COUNTRIES.find(
        (c) => c.iso2.toUpperCase() === selectedIso.toUpperCase()
      ) || null
    );
  }, [selectedIso]);

  /** Choix de langues officielles pour le pays sélectionné */
  const officialChoices: LangChoice[] = useMemo(() => {
    if (!selectedCountry?.languages) return [];
    const out: LangChoice[] = [];
    const seen = new Set<string>();
    for (const l of selectedCountry.languages) {
      if (l.indigenous) continue; // les autochtones vont dans leur propre bloc
      const appCode =
        (l.code && ISO_LANG_TO_APP[l.code.toLowerCase()]) ||
        languageNameToCode(l.name);
      if (!appCode || seen.has(appCode)) continue;
      seen.add(appCode);
      out.push({
        code: appCode,
        label: l.name,
        nativeLabel: l.nativeName,
        option: getLanguageOption(appCode),
        indigenous: false,
      });
    }
    return out;
  }, [selectedCountry]);

  /** Choix de langues autochtones pour le pays sélectionné */
  const indigenousChoices: LangChoice[] = useMemo(() => {
    if (!selectedCountry) return [];
    const nations = INDIGENOUS_BY_ISO2[selectedCountry.iso2.toUpperCase()] || [];
    const out: LangChoice[] = [];
    const seen = new Set<string>();

    for (const nation of nations) {
      for (const lang of nation.languages || []) {
        const code =
          (lang.code && ISO_LANG_TO_APP[lang.code.toLowerCase()]) ||
          languageNameToCode(lang.label);
        if (!code || seen.has(code)) continue;
        seen.add(code);
        const option = getLanguageOption(code);
        out.push({
          code,
          label: lang.label,
          nativeLabel: lang.endonym || option?.nativeLabel,
          option,
          indigenous: true,
          nation: nation.name,
        });
      }
    }

    return out;
  }, [selectedCountry]);

  function handleMapSelectLanguage(code: AppLanguage) {
    setLanguage(code);
  }

  const pageDir = currentLanguage.direction === "rtl" ? "rtl" : "ltr";

  return (
    <div
      dir={pageDir}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #060810 0%, #0A0D18 100%)",
        color: "white",
        padding: 24,
      }}
    >
      <TranslationStatusBanner />

      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              opacity: 0.7,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            NOXEL360 · NEXUS
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 32, lineHeight: 1.15 }}>
            {t("nexus.page.title")}
          </h1>
          <p style={{ margin: "6px 0 0", opacity: 0.72, maxWidth: 640 }}>
            {t("nexus.page.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => nav("/dashboard")}
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ← {t("nexus.back")}
        </button>
      </header>

      {/* Current language badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px",
          borderRadius: 999,
          border: "1px solid rgba(60,222,106,0.5)",
          background: "rgba(60,222,106,0.08)",
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 18 }}>{currentLanguage.flag}</span>
        <span style={{ fontWeight: 600 }}>
          {t("language.selector.current")}: {currentLanguage.label}
        </span>
        <span style={{ opacity: 0.7 }}>({currentLanguage.nativeLabel})</span>
        {currentLanguage.indigenous && (
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 999,
              background: "rgba(112,42,165,0.22)",
              border: "1px solid rgba(112,42,165,0.55)",
            }}
          >
            {t("nexus.indigenousBadge", undefined, "Indigenous")}
          </span>
        )}
      </div>

      {/* Search + filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("nexus.search.placeholder")}
          style={{
            flex: "1 1 260px",
            minWidth: 200,
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            fontSize: 15,
            outline: "none",
          }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {REGION_FILTERS.map((r) => {
            const active = region === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegion(r.id)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: active
                    ? "1px solid rgba(60,222,106,0.9)"
                    : "1px solid rgba(255,255,255,0.14)",
                  background: active
                    ? "rgba(60,222,106,0.14)"
                    : "rgba(255,255,255,0.04)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {t(r.labelKey, undefined, r.fallback)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content: list + detail */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Left: country list */}
        <div
          style={{
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            padding: 8,
            maxHeight: 560,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "8px 12px",
              fontSize: 12,
              opacity: 0.7,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {t("nexus.list.heading")} ({filteredCountries.length})
          </div>

          {filteredCountries.length === 0 && (
            <div style={{ padding: 16, opacity: 0.6, fontSize: 14 }}>
              {t("nexus.list.empty")}
            </div>
          )}

          {filteredCountries.map((c) => {
            const active = c.iso2.toUpperCase() === selectedIso.toUpperCase();
            const hasIndigenous =
              (INDIGENOUS_BY_ISO2[c.iso2.toUpperCase()] || []).length > 0;

            return (
              <button
                key={c.iso2}
                type="button"
                onClick={() => setSelectedIso(c.iso2.toUpperCase())}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  textAlign: "start",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: active ? "rgba(60,222,106,0.14)" : "transparent",
                  color: "white",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                {c.flag && (
                  <img
                    src={c.flag}
                    alt=""
                    loading="lazy"
                    style={{
                      width: 28,
                      height: 20,
                      objectFit: "cover",
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.1)",
                      flex: "0 0 auto",
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.65,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.iso2} · {c.region || "—"}
                  </div>
                </div>
                {hasIndigenous && (
                  <span
                    title={t("nexus.indigenousLanguagesAvailable", undefined, "Indigenous languages available")}
                    style={{
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 999,
                      background: "rgba(112,42,165,0.22)",
                      border: "1px solid rgba(112,42,165,0.55)",
                      flex: "0 0 auto",
                    }}
                  >
                    ★
                  </span>
                )}
                {active && (
                  <span
                    style={{
                      color: "rgb(60,222,106)",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: country detail */}
        <div
          style={{
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            padding: 20,
            maxHeight: 560,
            overflowY: "auto",
          }}
        >
          {!selectedCountry ? (
            <div style={{ opacity: 0.6 }}>{t("language.selector.selectCountry")}</div>
          ) : (
            <>
              {/* Country header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                {selectedCountry.flag && (
                  <img
                    src={selectedCountry.flag}
                    alt={selectedCountry.name}
                    style={{
                      width: 72,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ margin: 0, fontSize: 24 }}>{selectedCountry.name}</h2>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>
                    {selectedCountry.iso2} · {selectedCountry.iso3 || "—"} ·{" "}
                    {selectedCountry.region || "—"}
                  </div>
                </div>
              </div>

              {/* Meta grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 8,
                  fontSize: 13,
                  marginBottom: 18,
                }}
              >
                <InfoRow label={t("language.selector.capital")} value={selectedCountry.capital} />
                <InfoRow label={t("language.selector.subregion")} value={selectedCountry.subregion} />
                <InfoRow label={t("language.selector.domain")} value={selectedCountry.domain} />
                <InfoRow
                  label={t("language.selector.currency")}
                  value={
                    selectedCountry.currencyCode
                      ? `${selectedCountry.currencySymbol || ""} ${selectedCountry.currencyCode}`.trim()
                      : undefined
                  }
                />
              </div>

              {/* Official languages — cliquables */}
              <LanguageSection
                title={t("language.selector.officialLanguages")}
                emptyLabel="—"
                choices={officialChoices}
                activeCode={language}
                onPick={setLanguage}
                accentColor="rgba(60,222,106,0.9)"
                accentBg="rgba(60,222,106,0.14)"
              />

              {/* Indigenous languages — bloc dédié, pas sous-catégorie */}
              {indigenousChoices.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <LanguageSection
                    title={t("language.selector.indigenousLanguages")}
                    subtitle={t(
                      "nexus.indigenousRespect",
                      undefined,
                      "Languages of First Peoples and ancestral communities. Click any to set it as your interface language."
                    )}
                    emptyLabel="—"
                    choices={indigenousChoices}
                    activeCode={language}
                    onPick={setLanguage}
                    accentColor="rgba(112,42,165,0.9)"
                    accentBg="rgba(112,42,165,0.18)"
                    showNation
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Map */}
      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 12,
            opacity: 0.7,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10,
          }}
        >
          {t("nexus.map.heading")}
        </div>
        <NexusLanguageMap
          currentLanguage={language}
          onSelectLanguage={handleMapSelectLanguage}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          opacity: 0.6,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{value || "—"}</div>
    </div>
  );
}

function LanguageSection({
  title,
  subtitle,
  emptyLabel,
  choices,
  activeCode,
  onPick,
  accentColor,
  accentBg,
  showNation,
}: {
  title: string;
  subtitle?: string;
  emptyLabel: string;
  choices: LangChoice[];
  activeCode: string;
  onPick: (code: AppLanguage) => void;
  accentColor: string;
  accentBg: string;
  showNation?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          opacity: 0.7,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: subtitle ? 4 : 8,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 10, lineHeight: 1.4 }}>
          {subtitle}
        </div>
      )}

      {choices.length === 0 ? (
        <span style={{ opacity: 0.5, fontSize: 12 }}>{emptyLabel}</span>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {choices.map((opt) => {
            const active = opt.code === activeCode;
            const untranslated = !hasFullTranslation(opt.code);
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => onPick(opt.code)}
                title={
                  untranslated
                    ? "Interface not yet translated in this language — fallback to English"
                    : undefined
                }
                style={{
                  padding: "10px 14px",
                  borderRadius: 14,
                  border: active
                    ? `1px solid ${accentColor}`
                    : "1px solid rgba(255,255,255,0.12)",
                  background: active ? accentBg : "rgba(255,255,255,0.04)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  textAlign: "start",
                }}
              >
                <span style={{ textTransform: "uppercase", opacity: 0.6, fontSize: 10 }}>
                  {opt.code}
                </span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600 }}>
                    {opt.nativeLabel || opt.option?.nativeLabel || opt.label}
                  </span>
                  <span style={{ fontSize: 11, opacity: 0.65 }}>
                    {opt.label}
                    {showNation && opt.nation ? ` · ${opt.nation}` : ""}
                  </span>
                </div>
                {untranslated && (
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 999,
                      background: "rgba(255,200,60,0.15)",
                      border: "1px solid rgba(255,200,60,0.4)",
                      color: "rgb(255,220,130)",
                    }}
                    title="Interface translation in progress"
                  >
                    ⟳
                  </span>
                )}
                {active && <span style={{ color: "rgb(60,222,106)" }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


