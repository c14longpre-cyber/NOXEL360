import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../language/LanguageStore";
import { useI18n } from "../useI18n";
import NexusLanguageMap from "../language/nexus/NexusLanguageMap";
import { ALL_COUNTRIES } from "../language/nexus/countryData";
import { INDIGENOUS_BY_ISO2 } from "../language/nexus/indigenous";
import { LANGUAGE_CATALOG, getLanguageOption, hasFullTranslation, } from "../i18n/languageCatalog";
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
const REGION_FILTERS = [
    { id: "all", labelKey: "nexus.filter.all", fallback: "All" },
    { id: "Americas", labelKey: "nexus.filter.americas", fallback: "Americas" },
    { id: "Europe", labelKey: "nexus.filter.europe", fallback: "Europe" },
    { id: "Asia", labelKey: "nexus.filter.asia", fallback: "Asia" },
    { id: "Africa", labelKey: "nexus.filter.africa", fallback: "Africa" },
    { id: "Oceania", labelKey: "nexus.filter.oceania", fallback: "Oceania" },
];
const ISO_LANG_TO_APP = {};
for (const lang of LANGUAGE_CATALOG) {
    ISO_LANG_TO_APP[lang.code] = lang.code;
}
function languageNameToCode(name) {
    if (!name)
        return null;
    const n = name.toLowerCase().trim();
    for (const lang of LANGUAGE_CATALOG) {
        if (lang.label.toLowerCase() === n)
            return lang.code;
        if (lang.nativeLabel.toLowerCase() === n)
            return lang.code;
    }
    // Quelques alias fréquents pour les noms longs
    if (n.includes("english"))
        return "en";
    if (n.includes("french") || n.includes("français"))
        return "fr";
    if (n.includes("spanish") || n.includes("castilian") || n.includes("español"))
        return "es";
    if (n.includes("german") || n.includes("deutsch"))
        return "de";
    if (n.includes("italian") || n.includes("italiano"))
        return "it";
    if (n.includes("portuguese") || n.includes("português"))
        return "pt";
    if (n.includes("chinese") || n.includes("mandarin"))
        return "zh";
    if (n.includes("japanese"))
        return "ja";
    if (n.includes("korean"))
        return "ko";
    if (n.includes("arabic"))
        return "ar";
    if (n.includes("russian"))
        return "ru";
    if (n.includes("hindi"))
        return "hi";
    return null;
}
export default function NexusPage() {
    const { t } = useI18n();
    const { language, setLanguage, currentLanguage } = useLanguage();
    const nav = useNavigate();
    const [query, setQuery] = useState("");
    const [region, setRegion] = useState("all");
    const [selectedIso, setSelectedIso] = useState("CA");
    const filteredCountries = useMemo(() => {
        const q = query.trim().toLowerCase();
        return ALL_COUNTRIES.filter((c) => {
            if (region !== "all" && c.region !== region)
                return false;
            if (!q)
                return true;
            if (c.name.toLowerCase().includes(q))
                return true;
            if (c.iso2.toLowerCase().includes(q))
                return true;
            if (c.iso3?.toLowerCase().includes(q))
                return true;
            if (c.capital?.toLowerCase().includes(q))
                return true;
            if (c.languages?.some((l) => (l.name + " " + (l.nativeName || "")).toLowerCase().includes(q)))
                return true;
            return false;
        });
    }, [query, region]);
    const selectedCountry = useMemo(() => {
        return (ALL_COUNTRIES.find((c) => c.iso2.toUpperCase() === selectedIso.toUpperCase()) || null);
    }, [selectedIso]);
    /** Choix de langues officielles pour le pays sélectionné */
    const officialChoices = useMemo(() => {
        if (!selectedCountry?.languages)
            return [];
        const out = [];
        const seen = new Set();
        for (const l of selectedCountry.languages) {
            if (l.indigenous)
                continue; // les autochtones vont dans leur propre bloc
            const appCode = (l.code && ISO_LANG_TO_APP[l.code.toLowerCase()]) ||
                languageNameToCode(l.name);
            if (!appCode || seen.has(appCode))
                continue;
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
    const indigenousChoices = useMemo(() => {
        if (!selectedCountry)
            return [];
        const nations = INDIGENOUS_BY_ISO2[selectedCountry.iso2.toUpperCase()] || [];
        const out = [];
        const seen = new Set();
        for (const nation of nations) {
            for (const lang of nation.languages || []) {
                const code = (lang.code && ISO_LANG_TO_APP[lang.code.toLowerCase()]) ||
                    languageNameToCode(lang.label);
                if (!code || seen.has(code))
                    continue;
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
    function handleMapSelectLanguage(code) {
        setLanguage(code);
    }
    const pageDir = currentLanguage.direction === "rtl" ? "rtl" : "ltr";
    return (_jsxs("div", { dir: pageDir, style: {
            minHeight: "100vh",
            background: "linear-gradient(180deg, #060810 0%, #0A0D18 100%)",
            color: "white",
            padding: 24,
        }, children: [_jsx(TranslationStatusBanner, {}), _jsxs("header", { style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                    marginBottom: 20,
                }, children: [_jsxs("div", { children: [_jsx("div", { style: {
                                    fontSize: 12,
                                    opacity: 0.7,
                                    letterSpacing: "0.18em",
                                    textTransform: "uppercase",
                                }, children: "NOXEL360 \u00B7 NEXUS" }), _jsx("h1", { style: { margin: "6px 0 0", fontSize: 32, lineHeight: 1.15 }, children: t("nexus.page.title") }), _jsx("p", { style: { margin: "6px 0 0", opacity: 0.72, maxWidth: 640 }, children: t("nexus.page.subtitle") })] }), _jsxs("button", { type: "button", onClick: () => nav("/dashboard"), style: {
                            padding: "10px 16px",
                            borderRadius: 999,
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(255,255,255,0.05)",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 600,
                        }, children: ["\u2190 ", t("nexus.back")] })] }), _jsxs("div", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(60,222,106,0.5)",
                    background: "rgba(60,222,106,0.08)",
                    marginBottom: 20,
                }, children: [_jsx("span", { style: { fontSize: 18 }, children: currentLanguage.flag }), _jsxs("span", { style: { fontWeight: 600 }, children: [t("language.selector.current"), ": ", currentLanguage.label] }), _jsxs("span", { style: { opacity: 0.7 }, children: ["(", currentLanguage.nativeLabel, ")"] }), currentLanguage.indigenous && (_jsx("span", { style: {
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: "rgba(112,42,165,0.22)",
                            border: "1px solid rgba(112,42,165,0.55)",
                        }, children: t("nexus.indigenousBadge", undefined, "Indigenous") }))] }), _jsxs("div", { style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 20,
                    alignItems: "center",
                }, children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: t("nexus.search.placeholder"), style: {
                            flex: "1 1 260px",
                            minWidth: 200,
                            padding: "12px 16px",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(255,255,255,0.05)",
                            color: "white",
                            fontSize: 15,
                            outline: "none",
                        } }), _jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: REGION_FILTERS.map((r) => {
                            const active = region === r.id;
                            return (_jsx("button", { type: "button", onClick: () => setRegion(r.id), style: {
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
                                }, children: t(r.labelKey, undefined, r.fallback) }, r.id));
                        }) })] }), _jsxs("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
                    gap: 16,
                    marginBottom: 24,
                }, children: [_jsxs("div", { style: {
                            borderRadius: 20,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.03)",
                            padding: 8,
                            maxHeight: 560,
                            overflowY: "auto",
                        }, children: [_jsxs("div", { style: {
                                    padding: "8px 12px",
                                    fontSize: 12,
                                    opacity: 0.7,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                }, children: [t("nexus.list.heading"), " (", filteredCountries.length, ")"] }), filteredCountries.length === 0 && (_jsx("div", { style: { padding: 16, opacity: 0.6, fontSize: 14 }, children: t("nexus.list.empty") })), filteredCountries.map((c) => {
                                const active = c.iso2.toUpperCase() === selectedIso.toUpperCase();
                                const hasIndigenous = (INDIGENOUS_BY_ISO2[c.iso2.toUpperCase()] || []).length > 0;
                                return (_jsxs("button", { type: "button", onClick: () => setSelectedIso(c.iso2.toUpperCase()), style: {
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
                                    }, onMouseEnter: (e) => {
                                        if (!active)
                                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                    }, onMouseLeave: (e) => {
                                        if (!active)
                                            e.currentTarget.style.background = "transparent";
                                    }, children: [c.flag && (_jsx("img", { src: c.flag, alt: "", loading: "lazy", style: {
                                                width: 28,
                                                height: 20,
                                                objectFit: "cover",
                                                borderRadius: 3,
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                flex: "0 0 auto",
                                            } })), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsx("div", { style: {
                                                        fontWeight: 600,
                                                        fontSize: 14,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }, children: c.name }), _jsxs("div", { style: {
                                                        fontSize: 11,
                                                        opacity: 0.65,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }, children: [c.iso2, " \u00B7 ", c.region || "—"] })] }), hasIndigenous && (_jsx("span", { title: t("nexus.indigenousLanguagesAvailable", undefined, "Indigenous languages available"), style: {
                                                fontSize: 10,
                                                padding: "2px 6px",
                                                borderRadius: 999,
                                                background: "rgba(112,42,165,0.22)",
                                                border: "1px solid rgba(112,42,165,0.55)",
                                                flex: "0 0 auto",
                                            }, children: "\u2605" })), active && (_jsx("span", { style: {
                                                color: "rgb(60,222,106)",
                                                fontWeight: 700,
                                                fontSize: 16,
                                            }, children: "\u2713" }))] }, c.iso2));
                            })] }), _jsx("div", { style: {
                            borderRadius: 20,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.04)",
                            padding: 20,
                            maxHeight: 560,
                            overflowY: "auto",
                        }, children: !selectedCountry ? (_jsx("div", { style: { opacity: 0.6 }, children: t("language.selector.selectCountry") })) : (_jsxs(_Fragment, { children: [_jsxs("div", { style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                        marginBottom: 16,
                                    }, children: [selectedCountry.flag && (_jsx("img", { src: selectedCountry.flag, alt: selectedCountry.name, style: {
                                                width: 72,
                                                height: 48,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                border: "1px solid rgba(255,255,255,0.12)",
                                            } })), _jsxs("div", { style: { minWidth: 0 }, children: [_jsx("h2", { style: { margin: 0, fontSize: 24 }, children: selectedCountry.name }), _jsxs("div", { style: { opacity: 0.7, fontSize: 13 }, children: [selectedCountry.iso2, " \u00B7 ", selectedCountry.iso3 || "—", " \u00B7", " ", selectedCountry.region || "—"] })] })] }), _jsxs("div", { style: {
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                                        gap: 8,
                                        fontSize: 13,
                                        marginBottom: 18,
                                    }, children: [_jsx(InfoRow, { label: t("language.selector.capital"), value: selectedCountry.capital }), _jsx(InfoRow, { label: t("language.selector.subregion"), value: selectedCountry.subregion }), _jsx(InfoRow, { label: t("language.selector.domain"), value: selectedCountry.domain }), _jsx(InfoRow, { label: t("language.selector.currency"), value: selectedCountry.currencyCode
                                                ? `${selectedCountry.currencySymbol || ""} ${selectedCountry.currencyCode}`.trim()
                                                : undefined })] }), _jsx(LanguageSection, { title: t("language.selector.officialLanguages"), emptyLabel: "\u2014", choices: officialChoices, activeCode: language, onPick: setLanguage, accentColor: "rgba(60,222,106,0.9)", accentBg: "rgba(60,222,106,0.14)" }), indigenousChoices.length > 0 && (_jsx("div", { style: { marginTop: 18 }, children: _jsx(LanguageSection, { title: t("language.selector.indigenousLanguages"), subtitle: t("nexus.indigenousRespect", undefined, "Languages of First Peoples and ancestral communities. Click any to set it as your interface language."), emptyLabel: "\u2014", choices: indigenousChoices, activeCode: language, onPick: setLanguage, accentColor: "rgba(112,42,165,0.9)", accentBg: "rgba(112,42,165,0.18)", showNation: true }) }))] })) })] }), _jsxs("div", { style: {
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                    padding: 16,
                }, children: [_jsx("div", { style: {
                            fontSize: 12,
                            opacity: 0.7,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 10,
                        }, children: t("nexus.map.heading") }), _jsx(NexusLanguageMap, { currentLanguage: language, onSelectLanguage: handleMapSelectLanguage })] })] }));
}
function InfoRow({ label, value }) {
    return (_jsxs("div", { style: {
            padding: "8px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
        }, children: [_jsx("div", { style: {
                    fontSize: 10,
                    opacity: 0.6,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 2,
                }, children: label }), _jsx("div", { style: { fontSize: 13, fontWeight: 500 }, children: value || "—" })] }));
}
function LanguageSection({ title, subtitle, emptyLabel, choices, activeCode, onPick, accentColor, accentBg, showNation, }) {
    return (_jsxs("div", { children: [_jsx("div", { style: {
                    fontSize: 12,
                    opacity: 0.7,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: subtitle ? 4 : 8,
                }, children: title }), subtitle && (_jsx("div", { style: { fontSize: 12, opacity: 0.65, marginBottom: 10, lineHeight: 1.4 }, children: subtitle })), choices.length === 0 ? (_jsx("span", { style: { opacity: 0.5, fontSize: 12 }, children: emptyLabel })) : (_jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: choices.map((opt) => {
                    const active = opt.code === activeCode;
                    const untranslated = !hasFullTranslation(opt.code);
                    return (_jsxs("button", { type: "button", onClick: () => onPick(opt.code), title: untranslated
                            ? "Interface not yet translated in this language — fallback to English"
                            : undefined, style: {
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
                        }, children: [_jsx("span", { style: { textTransform: "uppercase", opacity: 0.6, fontSize: 10 }, children: opt.code }), _jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [_jsx("span", { style: { fontWeight: 600 }, children: opt.nativeLabel || opt.option?.nativeLabel || opt.label }), _jsxs("span", { style: { fontSize: 11, opacity: 0.65 }, children: [opt.label, showNation && opt.nation ? ` · ${opt.nation}` : ""] })] }), untranslated && (_jsx("span", { style: {
                                    fontSize: 10,
                                    padding: "2px 6px",
                                    borderRadius: 999,
                                    background: "rgba(255,200,60,0.15)",
                                    border: "1px solid rgba(255,200,60,0.4)",
                                    color: "rgb(255,220,130)",
                                }, title: "Interface translation in progress", children: "\u27F3" })), active && _jsx("span", { style: { color: "rgb(60,222,106)" }, children: "\u2713" })] }, opt.code));
                }) }))] }));
}
